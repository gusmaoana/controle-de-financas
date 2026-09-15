import { LancamentosView } from "@/components/lancamentos-view"

export default function DespesasPage() {
  return (
    <LancamentosView
      table="despesas"
      title="Despesas"
      subtitle="Cadastre saídas como mercado, aluguel e contas."
      addLabel="Nova despesa"
      emptyLabel="Nenhuma despesa cadastrada ainda. Use o formulário ao lado."
      valueClassName="text-destructive"
    />
  )
}
