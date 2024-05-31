import json

# Leia o arquivo JSON com os dados do usuário
with open('userData.json', 'r') as f:
    user_data = json.load(f)

# Leia o arquivo index.html
with open('gh-pages/index.html', 'r') as f:
    html_content = f.read()

# Substitua os placeholders pelos dados do usuário
html_content = html_content.replace('{{repo-count}}', str(user_data['public_repos']))
html_content = html_content.replace('{{followers-count}}', str(user_data['followers']))
html_content = html_content.replace('{{following-count}}', str(user_data['following']))

# Escreva o novo conteúdo de volta no index.html
with open('gh-pages/index.html', 'w') as f:
    f.write(html_content)
