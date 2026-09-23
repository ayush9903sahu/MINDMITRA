import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label:string; id?:string; name?:string; error?:string; helperText?:string; onValueChange?:(value:string)=>void;
}
export function FormField({label,id,name,error,helperText,onValueChange,onChange,...props}:FormFieldProps){
 const fieldId=id??name??label.toLowerCase().replace(/\s+/g,"-"); const errorId=`${fieldId}-error`; const helperId=`${fieldId}-helper`;
 const describedBy=[helperText?helperId:"",error?errorId:""].filter(Boolean).join(" ")||undefined;
 return <div className="mb-5"><label htmlFor={fieldId} className="mb-2 block text-lg font-medium text-gray-900">{label}</label><input id={fieldId} name={name??fieldId} {...props} onChange={(e)=>{onChange?.(e); onValueChange?.(e.target.value)}} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`w-full rounded-xl border-2 px-4 py-3 text-lg text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-brand-600 ${error?"border-red-600":"border-gray-300"}`}/>{helperText&&<p id={helperId} className="mt-2 text-base text-gray-600">{helperText}</p>}{error&&<p id={errorId} role="alert" className="mt-2 text-base font-medium text-red-700">{error}</p>}</div>;
}
