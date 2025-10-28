import os
import time

# Imprime todas as variáveis de ambiente
for key, value in os.environ.items():
    print(f"{key}={value}")

# Espera 30 segundos
time.sleep(30)

# Fecha o programa automaticamente
# (No Python, simplesmente sair do script)
print("Encerrando...")
