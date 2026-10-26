import { LoginButton, Logo } from "@/components/custom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export function AuthCard() {
  return (
    <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all animate-in fade-in zoom-in-95 duration-700">
      <CardHeader className="flex flex-col items-center text-center pb-0 pt-10">
        <Logo className="h-16 w-16 mb-6" />
        <CardTitle className="text-3xl font-extrabold text-primary mb-2 tracking-tight">Peach Organizer</CardTitle>
        <CardDescription className="text-base text-muted-foreground font-medium">
          O seu organizador pessoal, do seu jeito.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-full [&>button]:w-full [&>button]:h-12 [&>button]:text-md [&>button]:rounded-xl [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:font-medium [&>button]:shadow-lg hover:[&>button]:opacity-90 [&>button]:transition-opacity">
             <LoginButton />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-center border-t-0 p-4 pt-0 pb-10">
        <p className="text-center text-muted-foreground text-[13px] px-4 leading-relaxed">
          Área de acesso restrito. Faça login com um e-mail previamente autorizado para continuar.
        </p>
      </CardFooter>
    </Card>
  );
}
