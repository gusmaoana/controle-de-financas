export type Categoria = {
  id: string
  user_id: string
  nome: string
  descricao: string | null
  created_at: string
}

export type Lancamento = {
  id: string
  user_id: string
  descricao: string
  valor: number
  data: string
  categoria_id: string
  created_at: string
}
