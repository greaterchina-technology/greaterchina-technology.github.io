class Gallery {
    constructor() {
        this.groupA = document.querySelector('#group-a');
        this.groupB = document.querySelector('#group-b');
        this.watermarkPath = 'waterMark/watermark.png'; // 水印路径
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
        img.loading = 'lazy'; // 懒加载优化

        const watermark = document.createElement('img');
        watermark.src = this.watermarkPath;
        watermark.className = 'watermark';

        photoItem.appendChild(img);
        photoItem.appendChild(watermark);
        container.appendChild(photoItem);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    gallery.init();
}); 