"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {addPartModelToCollection, deletePartModelFromCollection } from "@/lib/actions/parts.action";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  label: string;
  printerPN: string;
  state: boolean;
}

export function PartsSwitcher({ label, printerPN, state }: Props) {

  const router = useRouter();
  const { toast } = useToast();
  const [switchState, setSwitchState] = useState(state);

  async function settingsChanged(checked: boolean) {
    try {

      if(checked ){
        const response = await addPartModelToCollection(printerPN, label, checked);

        if (response && response.success) {
          setSwitchState(checked);
          toast({ title: response.message, variant: 'default' });
          router.refresh();
        } else {
          setSwitchState(checked);
          toast({ title: response.message, variant: 'destructive' });
        }
      } else {
        const response = await deletePartModelFromCollection(printerPN, label);

        if (response && response.success) {
          setSwitchState(checked);
          toast({ title: response.message, variant: 'default' });
          if(response.success){
            router.refresh();
          }else{
            router.push('/settings/printer-parts');
          }

        } else {
          setSwitchState(checked);
          toast({ title: response.message, variant: 'destructive' });
        }
      }


    } catch (error) {
      console.error("An error occurred while changing the settings", error);
      toast({ title: "An error occurred while changing the setting", variant: 'destructive' });
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="part-switch" 
        checked={switchState}
        className="bg-gray-500"
        onCheckedChange={(checked) => settingsChanged(checked)} 
      />
      <Label htmlFor="part-switch" className="text-white text-md">{label}</Label>
    </div>
  );
}