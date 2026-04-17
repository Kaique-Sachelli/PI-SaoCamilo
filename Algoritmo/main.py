import requests

from motor_calculo import motor_calculo_atleta
from get_dados_api import buscar_dados_api_clima

#Dados do atleta
massa_corporal_pre_exercicio = 70
massa_corporal_pos_exercicio = 80
ingestao_de_fluidos = 30
volume_urinario = 80
duracao_do_treino = 10

#Localização do atleta e de sua equipe
latitude = -23.5262 
longitude = -46.6806


api_clima = buscar_dados_api_clima(latitude, longitude)
resultado_atleta = motor_calculo_atleta(massa_corporal_pre_exercicio, massa_corporal_pos_exercicio, ingestao_de_fluidos, volume_urinario, duracao_do_treino)

if api_clima: print(f"Contexto: {api_clima['api_temperatura']}°C, {api_clima['api_umidade']}% de umidade relativa.")
print(f"Taxa de Sudorese: {resultado_atleta['taxa_sudorese_estimada']} L/h.")
print(f"Percentual de variação de massa: {resultado_atleta['percentual_variacao_massa']}% de perda de massa.")
print(f"Recomendação para treinos similares: {resultado_atleta['recomendacao_ingestao_liquidos']} por hora.")
if resultado_atleta['alerta']: print(resultado_atleta['alerta'])
