import React, { useMemo, useState } from "react";
import { Form, InputGroup, ListGroup, Button } from "react-bootstrap";

/**
 * TagAutocomplete component
 * Props:
 * - tags: string[] — list of all tag names
 * - value: string — current input value
 * - onChange: (val: string) => void — called when input changes
 * - onSelect: (tag: string) => void — called when a tag is selected
 * - selectedTag?: string — currently selected tag (for highlighting)
 */
export default function TagAutocomplete({ tags, value, onChange, onSelect, selectedTag }) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);

  const normalizedTags = useMemo(() => {
    const arr = Array.isArray(tags) ? tags : [];
    return arr
      .map(t => {
        if (typeof t === 'string') return { label: t, alts: [] };
        const label = t && typeof t.label === 'string' ? t.label : '';
        const alts = t && Array.isArray(t.alts) ? t.alts.filter(s => typeof s === 'string') : [];
        return label ? { label, alts } : null;
      })
      .filter(Boolean);
  }, [tags]);

  const suggestions = useMemo(() => {
    const v = (value || "").trim().toLowerCase();
    const filtered = normalizedTags
      .filter(t => {
        if (!v) return true;
        const inLabel = t.label.toLowerCase().includes(v);
        const inAlt = t.alts.some(a => a.toLowerCase().includes(v));
        return inLabel || inAlt;
      })
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
    return filtered;
  }, [normalizedTags, value]);

  return (
    <div style={{position: 'relative', width: '320px', maxWidth: '100%', marginBottom: '1em'}}>
      <InputGroup>
        <Form.Control
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setOpen(true);
            setFocusedIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(()=>setOpen(false), 100)}
          placeholder="Search or select a tag..."
          onKeyDown={e => {
            if (!open || suggestions.length === 0) return;
            if (e.key === 'ArrowDown') {
              setFocusedIdx(idx => Math.min(suggestions.length-1, idx+1));
              e.preventDefault();
            } else if (e.key === 'ArrowUp') {
              setFocusedIdx(idx => Math.max(0, idx-1));
              e.preventDefault();
            } else if (e.key === 'Enter') {
              if (focusedIdx >= 0 && focusedIdx < suggestions.length) {
                const t = suggestions[focusedIdx];
                onSelect(t.label);
                setOpen(false);
                setFocusedIdx(-1);
                e.preventDefault();
              }
            }
          }}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="tags-autocomplete-list"
          aria-activedescendant={focusedIdx >= 0 ? `ac-tag-${focusedIdx}` : undefined}
        />
      {Boolean(value) && (
          <Button
            variant="outline-secondary"
            onMouseDown={(e) => { e.preventDefault(); onChange(''); setOpen(false); setFocusedIdx(-1); if (onSelect) onSelect(''); }}
            aria-label="Clear"
            title="Clear"
          >
            ×
          </Button>
        )}
      </InputGroup>
      {open && suggestions.length > 0 && (
        <div style={{position:'absolute', top:'100%', left:0, right:0, zIndex:10, maxHeight:'300px', overflowY:'auto'}}>
          <ListGroup id="tags-autocomplete-list" className="shadow">
            {suggestions.map((t, i) => {
              const selected = focusedIdx === i;
              const uniqueAlts = Array.from(new Set((t.alts || []).filter(Boolean)));
              const previewAlts = uniqueAlts.slice(0, 8).join(', ');
              const extraCount = uniqueAlts.length > 8 ? uniqueAlts.length - 8 : 0;
              return (
                <ListGroup.Item
                  action
                  key={t.label || i}
                  id={`ac-tag-${i}`}
                  active={selected}
                  onMouseDown={() => {
                    onSelect(t.label);
                    setOpen(false);
                    setFocusedIdx(-1);
                  }}
                  style={{
                    fontWeight: t.label === selectedTag ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div>{t.label}</div>
                    {uniqueAlts.length > 0 && (
                      <div style={{ color: '#6c757d', fontSize: '0.85em' }}>
                        {previewAlts}{extraCount ? `, +${extraCount} more` : ''}
                      </div>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      )}
      {open && suggestions.length === 0 && (
        <div className="border border-secondary-subtle bg-white shadow-sm" style={{color:'#888', position:'absolute', top:'100%', left:0, right:0, zIndex:10, padding:'0.5em'}}>No matches</div>
      )}
    </div>
  );
}
