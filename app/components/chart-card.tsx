import type { Period } from "../types/period";
import { PeriodSelect } from "./period-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function ChartCard({
  title,  children,
}: {
  title: string; 
  children: React.ReactNode
}) {
  return (<>
          <Card className="">
            <CardHeader>
              <div className="flex items-center gap-1 justify-between">
                
                  <CardTitle>{title}</CardTitle>
                
                
              </div>
            </CardHeader>
            <CardContent className="h-full w-full">
              {children}
            </CardContent>
          </Card>
    </>
  )
}