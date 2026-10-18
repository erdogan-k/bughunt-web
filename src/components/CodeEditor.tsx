import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRunShortcut?: () => void;
}

export function CodeEditor({ code, onChange, onRunShortcut }: CodeEditorProps) {
  const [usePlainEditor, setUsePlainEditor] = useState(
    () => import.meta.env.MODE === 'test'
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onRunShortcut) {
      e.preventDefault();
      onRunShortcut();
    }
  };

  return (
    <div className="relative h-full w-full bg-[#0d1117]" onKeyDown={handleKeyDown}>
      {/* Editor mode switcher for accessibility / offline fallback */}
      <div className="absolute right-3 bottom-2 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setUsePlainEditor((prev) => !prev)}
          className="rounded border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 font-mono text-[10px] text-zinc-400 transition hover:border-emerald-500/40 hover:text-emerald-300"
        >
          {usePlainEditor ? 'Monaco Editöre Geç' : 'Hızlı Metin Modu'}
        </button>
      </div>

      {usePlainEditor ? (
        <textarea
          aria-label="Kod Editörü"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="h-[360px] lg:h-[440px] w-full resize-none bg-[#0d1117] p-4 font-mono text-sm leading-relaxed text-emerald-100 focus:outline-none"
        />
      ) : (
        <div className="h-[360px] lg:h-[440px] w-full">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => onChange(val ?? '')}
            loading={
              <div className="flex h-full w-full flex-col p-4">
                <div className="mb-2 font-mono text-xs text-emerald-400">
                  // Monaco Editör yükleniyor... (Hemen düzenlemek için aşağıdan devam edebilirsiniz)
                </div>
                <textarea
                  aria-label="Kod Editörü"
                  value={code}
                  onChange={(e) => onChange(e.target.value)}
                  spellCheck={false}
                  className="h-full w-full resize-none bg-[#0d1117] font-mono text-sm leading-relaxed text-emerald-100 focus:outline-none"
                />
              </div>
            }
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', Consolas, monospace",
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 16, bottom: 16 },
              wordWrap: 'on',
            }}
          />
        </div>
      )}
    </div>
  );
}
