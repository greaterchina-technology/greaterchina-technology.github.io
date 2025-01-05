class Gallery {
    constructor() {
        this.groupA = document.querySelector('#group-a');
        this.groupB = document.querySelector('#group-b');
        this.watermarkPath = 'waterMark/watermark.png';
        this.setupModal();
    }

    setupModal() {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-content"><img src="" alt=""></div>`;
        document.body.appendChild(modal);

        // 点击模态框关闭
        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    async init() {
        await this.loadImages('A', this.groupA);
        await this.loadImages('B', this.groupB);
    }

    async loadImages(group, container) {
        try {
            const response = await fetch(`Photo/${group}`);
            const files = await response.json();
            
            files.forEach(file => {
                if (file.endsWith('.jpg') || file.endsWith('.png')) {
                    this.createPhotoElement(`Photo/${group}/${file}`, container);
                }
            });
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    createPhotoElement(src, container) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';

        const watermark = document.createElement('img');
        watermark.src = this.watermarkPath;
        watermark.className = 'watermark';

        // 添加点击事件
        photoItem.addEventListener('click', () => {
            const modal = document.querySelector('.modal');
            const modalImg = modal.querySelector('img');
            modalImg.src = src;
            modal.style.display = 'block';
        });

        photoItem.appendChild(img);
        photoItem.appendChild(watermark);
        container.appendChild(photoItem);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    gallery.init();
}); 