class Gallery {
    constructor() {
        this.currentGroup = null;
        this.currentIndex = 0;
        this.images = [];
        this.setupGallery();
        this.setupModal();
    }

    setupGallery() {
        this.groupA = document.querySelector('#group-a .photo-grid');
        this.groupB = document.querySelector('#group-b .photo-grid');
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
        // 加载A组所有图片
        if (galleryConfig.groupA && galleryConfig.groupA.length > 0) {
            galleryConfig.groupA.forEach((src, index) => {
                this.loadImage(src, this.groupA, 'A', index);
            });
        }

        // 加载B组所有图片
        if (galleryConfig.groupB && galleryConfig.groupB.length > 0) {
            galleryConfig.groupB.forEach((src, index) => {
                this.loadImage(src, this.groupB, 'B', index);
            });
        }
    }

    loadImage(src, container, group, index) {
        this.createPhotoElement(src, container, group, index);
    }

    createPhotoElement(src, container, group, index) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.onerror = () => {
            console.error('Image failed to load:', src);
            photoItem.style.display = 'none';
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