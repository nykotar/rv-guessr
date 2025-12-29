import { useNavigate } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'

export default function Home() {
  let navigate = useNavigate();

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>RV Guessr</CardTitle>
                  <CardDescription>
                    This is a proof of concept and does not represent the final product. Any feedback is welcome!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Remote View the target and guess where it is!
                  <div className="flex justify-center">
                    <Button className="mt-4" size="lg" onClick={() => navigate('/game')}>Play</Button>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
  )
}