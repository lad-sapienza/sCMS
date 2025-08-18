import React, { useMemo, useState } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";

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

  const suggestions = useMemo(() => {
    const v = (value || "").trim().toLowerCase();
    const filtered = (Array.isArray(tags) ? tags : [])
      .filter(t => typeof t === 'string')
      .filter(t => t.toLowerCase().includes(v))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    return filtered;
  }, [tags, value]);

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
                const tag = suggestions[focusedIdx];
                onSelect(tag);
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
      </InputGroup>
      {open && suggestions.length > 0 && (
        <div style={{position:'absolute', top:'100%', left:0, right:0, zIndex:10, maxHeight:'300px', overflowY:'auto'}}>
          <ListGroup id="tags-autocomplete-list" className="shadow">
            {suggestions.map((tag, i) => {
              const selected = focusedIdx === i;
              return (
                <ListGroup.Item
                  action
                  key={tag || i}
                  id={`ac-tag-${i}`}
                  active={selected}
                  onMouseDown={() => {
                    onSelect(tag);
                    setOpen(false);
                    setFocusedIdx(-1);
                  }}
                  style={{
                    fontWeight: tag === selectedTag ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
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
