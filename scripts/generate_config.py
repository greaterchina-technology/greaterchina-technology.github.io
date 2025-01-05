import os
import json

def generate_gallery_config():
    config = {
        'groupA': [],
        'groupB': []
    }
    
    # 扫描A组图片
    a_path = 'Photos/A'
    if os.path.exists(a_path):
        for file in os.listdir(a_path):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                config['groupA'].append(f'Photos/A/{file}')
    
    # 扫描B组图片
    b_path = 'Photos/B'
    if os.path.exists(b_path):
        for file in os.listdir(b_path):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                config['groupB'].append(f'Photos/B/{file}')
    
    # 写入配置文件
    with open('js/config.js', 'w', encoding='utf-8') as f:
        f.write('const galleryConfig = ' + json.dumps(config, indent=2) + ';')

if __name__ == '__main__':
    generate_gallery_config() 