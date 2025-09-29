import React from "react"
/* eslint-disable no-new-func, no-useless-escape */
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism"

const formatProps = (props, indentLevel = 0) => {
  if (!props) return []
  return Object.entries(props)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      if (key === 'className') return `className="${value}"`
      if (typeof value === 'string') {
        if (value.includes('${')) return `${key}={\`${value}\`}`
        if (value.includes('item.')) return `${key}={${value}}`
        return `${key}=${JSON.stringify(value)}`
      }
      if (typeof value === 'function') {
        const fnStr = value.toString()
        if (fnStr.includes('createElement')) {
          return `${key}={${decompileJSX(fnStr)}}`
        }
        return `${key}={${fnStr}}`
      }
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return `${key}={[${value.map(v => JSON.stringify(v)).join(', ')}]}`
        }
        // pretty print objects as multiline JS-like literals
        return `${key}={${prettyPrint(value, indentLevel + 1)}}`
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return `${key}={${value}}`
      }
      return `${key}={${value}}`
    })
}

// pretty-print JS values (objects/arrays/primitives) using JS-like syntax
const prettyPrint = (value, level = 0) => {
  const indent = (n) => '  '.repeat(n)
  const isIdentifier = (s) => /^[$A-Z_][0-9A-Z_$]*$/i.test(s)

  const pp = (v, lvl) => {
    if (v === null) return 'null'
    if (typeof v === 'string') return JSON.stringify(v)
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]'
      const items = v.map(i => pp(i, lvl + 1))
      return '[\n' + items.map(it => indent(lvl + 1) + it).join(',\n') + '\n' + indent(lvl) + ']'
    }
    if (typeof v === 'object') {
      const keys = Object.keys(v)
      if (keys.length === 0) return '{}'
      const lines = keys.map(k => {
        const keyStr = isIdentifier(k) ? k : `"${k}"`
        return indent(lvl + 1) + keyStr + ': ' + pp(v[k], lvl + 1)
      })
      return '{\n' + lines.join(',\n') + '\n' + indent(lvl) + '}'
    }
    return String(v)
  }

  return pp(value, level)
}

const decompileJSX = (str) => {
  // Tokenize createElement(...) into a tiny AST and recompose as JSX
  const cleanup = s => s.replace(/\/\*#__PURE__\*\//g, '')
                        .replace(/react__WEBPACK_IMPORTED_MODULE_0___default\(\)./g, '')
                        .replace(/_components\./g, '')
                        .trim()

  // tokenize helper removed (unused)

  const splitTopLevel = (input, sep = ',') => {
    const out = []
    let buf = ''
    let depthPar = 0, depthCur = 0, depthBr = 0
    let inQuote = null
    for (let chIdx = 0; chIdx < input.length; chIdx++) {
      const ch = input[chIdx]
      if (inQuote) {
        if (ch === inQuote && input[chIdx - 1] !== '\\') inQuote = null
        buf += ch
        continue
      }
      if (ch === '"' || ch === "'") { inQuote = ch; buf += ch; continue }
      if (ch === '(') depthPar++
      else if (ch === ')') depthPar--
      else if (ch === '{') depthCur++
      else if (ch === '}') depthCur--
      else if (ch === '[') depthBr++
      else if (ch === ']') depthBr--

      if (ch === sep && depthPar === 0 && depthCur === 0 && depthBr === 0) {
        out.push(buf.trim())
        buf = ''
      } else {
        buf += ch
      }
    }
    if (buf.trim()) out.push(buf.trim())
    return out.filter(Boolean)
  }

  const parseCreateElement = (s) => {
    // find the last (innermost) opening 'createElement(' allowing spaces
    const re = /createElement\s*\(/g
    let match, start = -1
    while ((match = re.exec(s)) !== null) start = match.index
    if (start === -1) return { node: null, end: -1 }

    // parse balanced parentheses for this createElement call
  let i = start + 'createElement('.length
    let depth = 1
      for (; i < s.length; i++) {
      if (s[i] === '(') depth++
      else if (s[i] === ')') {
        depth--
        if (depth === 0) break
      }
    }
      const call = s.slice(start, i + 1)

    // Extract parts: tag, props, children (split at top-level commas)
    const inner = call.replace(/^createElement\(|\)$/g, '')
    const splitTopLevel = (input, sep = ',') => {
      const out = []
      let buf = ''
      let depthPar = 0, depthCur = 0, depthBr = 0
      let inQuote = null
      for (let chIdx = 0; chIdx < input.length; chIdx++) {
        const ch = input[chIdx]
        if (inQuote) {
          if (ch === inQuote && input[chIdx - 1] !== '\\') inQuote = null
          buf += ch
          continue
        }
        if (ch === '"' || ch === "'") { inQuote = ch; buf += ch; continue }
        if (ch === '(') depthPar++
        else if (ch === ')') depthPar--
        else if (ch === '{') depthCur++
        else if (ch === '}') depthCur--
        else if (ch === '[') depthBr++
        else if (ch === ']') depthBr--

        if (ch === sep && depthPar === 0 && depthCur === 0 && depthBr === 0) {
          out.push(buf.trim())
          buf = ''
        } else {
          buf += ch
        }
      }
      if (buf.trim()) out.push(buf.trim())
      return out.filter(Boolean)
    }

    const parts = splitTopLevel(inner, ',')

    const tag = parts[0] || 'div'
    const props = parts[1] || 'null'
    const children = parts.slice(2)

    const node = { tag: tag.replace(/['"]/g, ''), props, children }
    return { node, start, end: i + 1 }
  }

  const formatProps = (propsStr) => {
    if (!propsStr || propsStr === 'null') return ''
    const content = propsStr.replace(/^{|}$/g, '').trim()
    if (!content) return ''

    // Try to evaluate the props string as a JS object so we can pretty-print object literals
    try {
      // eslint-disable-next-line no-new-func
      const obj = Function('return (' + propsStr + ')')()
      if (obj && typeof obj === 'object') {
        const entries = Object.entries(obj).filter(([k]) => k !== 'children')
        const formatted = entries.map(([key, val]) => {
          if (typeof val === 'object') {
            return `${key}={${prettyPrint(val, 1)}}`
          }
          if (typeof val === 'string') {
            return `${key}=${JSON.stringify(val)}`
          }
          return `${key}={${JSON.stringify(val)}}`
        }).join(' ')
        return formatted ? ' ' + formatted : ''
      }
    } catch (e) {
      // fall back to previous simple parser below
    }

    const parts = splitTopLevel(content, ',')
  const lines = parts.map(p => {
      const [k, ...rest] = splitTopLevel(p, ':')
      const key = (k || '').trim()
      const val = (rest || []).join(':').trim()
      // style and simple string handling
  if (key === 'className') return `className="${val.replace(/['\"]/g,'')}"`
  if (key === 'style') return `style={${val.replace(/^{|}$/g,'')}}`
    if (/^['"]/.test(val) && /['"]$/.test(val)) return `${key}=${val}`
      if (val.includes('item.')) return `${key}={${val}}`

      // if value looks like an object/array literal and doesn't contain functions, try to evaluate and prettyPrint
      if ((val.startsWith('{') || val.startsWith('[')) && !/=>|function|createElement/.test(val)) {
        try {
          // eslint-disable-next-line no-new-func
          const obj = Function('return (' + val + ')')()
          return `${key}={${prettyPrint(obj, 1)}}`
        } catch (e) {
          // fall through to default
        }
      }

      if (val.includes('+')) return `${key}={\`${val.replace(/['"]/g,'').replace(/\s*\+\s*/g,'')}\`}`
      return `${key}={${val}}`
    })
    return lines.length ? '\n' + lines.join('\n') : ''
  }

  // recursive replace: find innermost createElement and replace with JSX
  let out = cleanup(str)
  while (out.includes('createElement')) {
  const { node, start, end } = parseCreateElement(out)
    if (!node) break
    // convert children: each child may itself contain createElement, leave it to next iterations
    const childStr = node.children.map(c => c.trim()).filter(Boolean).join(',')
    const childParts = splitTopLevel(childStr, ',')
    const childProcessed = childParts
      .map(c => c.trim())
      .map(c => {
        if (!c) return ''
        // string literals -> remove quotes
        if (/^['"]/.test(c) && /['"]$/.test(c)) return c.slice(1, -1)
        // expressions wrapped in braces
        if (c.startsWith('{') && c.endsWith('}')) {
          const inner = c.slice(1, -1).trim()
          // if the inner expression contains createElement, decompile it and remove the braces
          if (inner.includes('createElement')) return decompileJSX(inner)
          // preserve other expressions (like {item.prop}) as-is
          return `{${inner}}`
        }
        // bare createElement calls
        if (c.includes('createElement')) return decompileJSX(c)
        // item references -> keep as expression
        if (c.includes('item.')) return `{${c}}`
        return c
      })
      .filter(Boolean)
      .join(' ')

    const replacement = childProcessed.length > 0
      ? `<${node.tag}${formatProps(node.props)}>${childProcessed}</${node.tag}>`
      : `<${node.tag}${formatProps(node.props)} />`

    out = out.slice(0, start) + replacement + out.slice(end)
  }

  // final cleanup: remove braces that directly wrap JSX tags (keep expressions like {item.x})
  out = out.replace(/\{\s*</g, '<')
           .replace(/>\s*\}/g, '>')
           .replace(/<\/(\w[\w:-]*)>\s*\}/g, '</$1>')
  // normalize spacing and split into tag blocks — collapse spaces/tabs but preserve newlines
  out = out.replace(/>\s*</g, '>\n<').replace(/[^\S\r\n]+/g, ' ')

  const lines = out.split('\n').map(l => l.replace(/\s+$/,'')).filter(l => l.trim())

  // Pretty-print with indentation by tracking tag depth
  const pretty = []
  let depth = 0
  lines.forEach(line => {
    // closing tag decreases depth
    if (/^<\/\w/.test(line)) depth = Math.max(0, depth - 1)
    const indent = '  '.repeat(depth)
    pretty.push(indent + line)
    // opening tag that is not self-closing increases depth
    if (/^<[^/!][^>]*[^\/]?>$/.test(line) && !/^<\w+\s*\/\>/.test(line) && !/^<hr/.test(line)) {
      if (!/\/>$/.test(line)) depth++
    }
  })

  return pretty.join('\n')
}

const elementToJSX = (element, level = 0) => {
  if (!element) return ''
  if (typeof element === 'string') {
    return element.trim().startsWith('{') && element.trim().endsWith('}')
      ? element
      : element
  }
  if (typeof element === 'number') return String(element)
  if (typeof element === 'string' && element.includes('createElement')) {
    return decompileJSX(element)
  }
  if (!React.isValidElement(element)) return ''

  const indent = '  '.repeat(level)
  const type = typeof element.type === 'string' ? element.type : element.type.name || 'Component'
  const props = formatProps(element.props, level)
  // build props string with proper indentation for multiline prop values
  let propsString = ''
  if (props.length > 0) {
    const propLines = []
    props.forEach(p => {
      if (p.includes('\n')) {
        const parts = p.split('\n')
        propLines.push(indent + '  ' + parts[0])
        for (let i = 1; i < parts.length; i++) {
          propLines.push(indent + '    ' + parts[i])
        }
      } else {
        propLines.push(indent + '  ' + p)
      }
    })
    propsString = '\n' + propLines.join('\n')
  }
  
  const children = React.Children.toArray(element.props.children)
    .filter(child => child !== undefined && child !== null && child !== false)
  
  if (children.length === 0) {
    if (propsString) return `${indent}<${type}${propsString}\n${indent}/>`
    return `${indent}<${type}${propsString} />`
  }

  if (children.length === 1 && typeof children[0] === 'string') {
    const childContent = children[0].trim()
    const open = `${indent}<${type}${propsString}>`
    const close = `${indent}</${type}>`
    return childContent.includes('\n')
      ? `${open}\n  ${indent}${childContent}\n${close}`
      : `${open}${childContent}${close}`
  }

  const childrenString = children
    .map(child => elementToJSX(child, level + 1))
    .join('\n')

  return `${indent}<${type}${propsString}>\n${childrenString}\n${indent}</${type}>`
}

const Documenter = ({ children }) => {
  const code = React.Children.toArray(children)
    .map(child => elementToJSX(child))
    .join('\n\n')

  // Ensure we have explicit newlines between tags so browsers show multiple lines
  let displayCode = code
  if (!displayCode.includes('\n')) {
    displayCode = displayCode.replace(/>\s*</g, '>\n<')
  }
  // debug logs removed
  
  return (
    <div className="row">
      <div className="col-sm-4">
        <SyntaxHighlighter
          language="jsx"
          style={okaidia}
          wrapLongLines={false}
          customStyle={{ whiteSpace: 'pre', overflowX: 'auto' }}
          codeTagProps={{ style: { whiteSpace: 'pre' } }}
        >
          {displayCode}
        </SyntaxHighlighter>
      </div>
      <div className="col-sm-8">{children}</div>
    </div>
  )
}

export { Documenter }