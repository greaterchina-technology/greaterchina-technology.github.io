class Gallery {
    constructor() {
        this.projectsContainer = document.querySelector('.projects-grid');
        this.setupModal();
        this.loadProjects();
    }

    setupModal() {
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img class="modal-image" src="" alt="大图">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.querySelector('.modal');
        const closeBtn = modal.querySelector('.modal-close');

        closeBtn.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    async loadProjects() {
        try {
            // 获取Photos目录下的所有文件夹（项目）
            const response = await fetch('https://api.github.com/repos/你的用户名/你的仓库名/contents/Photos');
            const folders = await response.json();
            
            // 为每个项目创建展示区
            for (const folder of folders) {
                if (folder.type === 'dir') {
                    await this.createProjectSection(folder);
                }
            }
        } catch (error) {
            console.error('加载项目失败:', error);
            this.showError('无法加载项目列表');
        }
    }

    async createProjectSection(folder) {
        try {
            // 获取项目中的照片
            const response = await fetch(folder.url);
            const files = await response.json();
            
            // 过滤出图片文件
            const images = files.filter(file => 
                file.name.match(/\.(jpg|jpeg|png|gif)$/i)
            );

            if (images.length > 0) {
                // 创建项目区块
                const projectSection = document.createElement('div');
                projectSection.className = 'project-section';
                projectSection.innerHTML = `
                    <h2>${folder.name}</h2>
                    <div class="photo-grid"></div>
                `;
                
                const photoGrid = projectSection.querySelector('.photo-grid');
                
                // 添加照片
                images.forEach(image => {
                    this.createPhotoElement(image.download_url, photoGrid);
                });

                this.projectsContainer.appendChild(projectSection);
            }
        } catch (error) {
            console.error(`加载项目 ${folder.name} 失败:`, error);
        }
    }

    createPhotoElement(src, container) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';

        img.onerror = () => {
            photoItem.innerHTML = `
                <div class="error-message">
                    <p>图片加载失败</p>
                </div>
            `;
        };

        photoItem.addEventListener('click', () => this.openModal(src));
        photoItem.appendChild(img);
        container.appendChild(photoItem);
    }

    openModal(src) {
        const modal = document.querySelector('.modal');
        const modalImg = modal.querySelector('.modal-image');
        modalImg.src = src;
        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        this.projectsContainer.appendChild(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
}); 