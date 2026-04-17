import requests

def buscar_dados_api_clima(lat, lon):
    api_key = "767b1b3605d38e5550bdcf4fbed7be5f"
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=pt_br"

    try:
      response = requests.get(url)
      response.raise_for_status()
      api_dados_clima = response.json()

      return {
        "api_temperatura": api_dados_clima['main']['temp'],
        "api_umidade": api_dados_clima['main']['humidity'],
        "api_sensacao_termica": api_dados_clima['main']['feels_like']
      }
    
    except Exception as e:
      print(f"Erro na API de Clima: {e}")
      return None