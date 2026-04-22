def motor_calculo_atleta(massa_corporal_pre_exercicio, massa_corporal_pos_exercicio, ingestao_de_fluidos, volume_urinario, duracao_do_treino):
  perda_massa_corporal_ajustada = (massa_corporal_pre_exercicio - massa_corporal_pos_exercicio) + ingestao_de_fluidos - volume_urinario

  taxa_sudorese_estimada = perda_massa_corporal_ajustada / duracao_do_treino

  percentual_variacao_massa = ((massa_corporal_pre_exercicio - massa_corporal_pos_exercicio) / massa_corporal_pre_exercicio) * 100

  alerta = ""
  if massa_corporal_pos_exercicio > massa_corporal_pre_exercicio:
    alerta = "ALERTA: Ganho de peso! Risco de hiponatremia (excesso de hidratação)."
  elif percentual_variacao_massa > 2:
    alerta = "ALERTA: Desidratação superior a 2%. Queda de performance provável."

  sugestao_minima_liquidos = taxa_sudorese_estimada * 1000
  sugestao_maxima_liquidos = taxa_sudorese_estimada * 1200

  return {
    "perda_massa_corporal_ajustada": round(perda_massa_corporal_ajustada, 2),
    "taxa_sudorese_estimada": round(taxa_sudorese_estimada, 2),
    "percentual_variacao_massa": round(percentual_variacao_massa, 2),
    "alerta": alerta,
    "recomendacao_ingestao_liquidos": f"{int(sugestao_minima_liquidos)}ml a {int(sugestao_maxima_liquidos)}ml."
    }