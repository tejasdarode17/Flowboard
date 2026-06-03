import { Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/shared/hooks/useTheme";

function DarkMode() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/50 transition-all duration-150 text-muted-foreground hover:text-foreground">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="text-[13px] flex-1 text-left ml-2.5">
            {theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}
          </span>
          <span className="text-[11px] text-muted-foreground/50">Theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-50 ml-2 rounded-xl">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] cursor-pointer rounded-lg"
        >
          <Sun size={15} />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] cursor-pointer rounded-lg"
        >
          <Moon size={15} />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] cursor-pointer rounded-lg"
        >
          <Monitor size={15} />
          <span>System</span>
          {theme === "system" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DarkMode;
