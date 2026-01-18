import { Bot } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Logo con marca Funnelhot */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg">Funnelhot</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">AI Studio</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
