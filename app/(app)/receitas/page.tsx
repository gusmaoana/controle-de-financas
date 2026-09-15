import { LancamentosView } from "@/components/lancamentos-view"

export default function ReceitasPage() {
  return (
    <LancamentosView
      table="receitas"
      title="Receitas"
      subtitle="Cadastre entradas como salário, freelance e outros."
      addLabel="Nova receita"
      emptyLabel="Nenhuma receita cadastrada ainda. Use o formulário ao lado."
      valueClassName="text-emerald-600"
    />
  )
}
