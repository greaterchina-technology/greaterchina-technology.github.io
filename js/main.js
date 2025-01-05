class Gallery {
    constructor() {
        this.currentGroup = null;
        this.currentIndex = 0;
        this.images = [];
        this.setupGallery();
        this.setupModal();
        
        // 添加调试信息
        console.log('Gallery initialized');
        console.log('Config:', galleryConfig);
    }

    setupGallery() {
        this.groupA = document.querySelector('#group-a .photo-grid');
        this.groupB = document.querySelector('#group-b .photo-grid');
        
        if (!this.groupA || !this.groupB) {
            console.error('Could not find photo grid containers');
        }
    }

    setupModal() {
        const modalHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-nav">
                        <button class="prev">&lt;</button>
                        <button class="next">&gt;</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.querySelector('.modal');
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('.prev');
        const nextBtn = modal.querySelector('.next');

        closeBtn.addEventListener('click', () => this.closeModal());
        prevBtn.addEventListener('click', () => this.showPrevImage());
        nextBtn.addEventListener('click', () => this.showNextImage());

        document.addEventListener('keydown', (e) => {
            if (!modal.style.display === 'block') return;
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.showPrevImage();
            if (e.key === 'ArrowRight') this.showNextImage();
        });
    }

    init() {
        console.log('Loading images...');
        
        // 加载A组所有图片
        if (galleryConfig.groupA && galleryConfig.groupA.length > 0) {
            console.log('Loading Group A images:', galleryConfig.groupA);
            galleryConfig.groupA.forEach((src, index) => {
                this.loadImage(src, this.groupA, 'A', index);
            });
        } else {
            console.warn('No images found in Group A');
        }

        // 加载B组所有图片
        if (galleryConfig.groupB && galleryConfig.groupB.length > 0) {
            console.log('Loading Group B images:', galleryConfig.groupB);
            galleryConfig.groupB.forEach((src, index) => {
                this.loadImage(src, this.groupB, 'B', index);
            });
        } else {
            console.warn('No images found in Group B');
        }
    }

    loadImage(src, container, group, index) {
        console.log(`Loading image: ${src}`);
        this.createPhotoElement(src, container, group, index);
    }

    createPhotoElement(src, container, group, index) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        
        // 增强错误处理
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            photoItem.innerHTML = `
                <div style="padding: 20px; text-align: center; color: red;">
                    图片加载失败: ${src}
                </div>
            `;
        };

        // 添加加载成功处理
        img.onload = () => {
            console.log(`Successfully loaded image: ${src}`);
        };

        photoItem.addEventListener('click', () => {
            this.openModal(src, group, index);
        });

        photoItem.appendChild(img);
        container.appendChild(photoItem);
    }

    openModal(src, group, index) {
        const modal = document.querySelector('.modal');
        const modalImg = modal.querySelector('.modal-image');
        
        this.currentGroup = group;
        this.currentIndex = index;
        this.images = galleryConfig[`group${group}`];

        modalImg.src = src;
        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
    }

    showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        const modalImg = document.querySelector('.modal-image');
        modalImg.src = this.images[this.currentIndex];
    }

    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        const modalImg = document.querySelector('.modal-image');
        modalImg.src = this.images[this.currentIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    gallery.init();
}); 