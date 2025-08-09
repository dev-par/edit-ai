import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>Hello how are you <br/>
    <Button variant="primary">Button</Button>
    <Button variant="glass">Button</Button>
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
    Hello How are you 
    </div>
    </div>
  );
}