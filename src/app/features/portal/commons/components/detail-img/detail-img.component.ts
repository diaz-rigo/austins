import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-detail-img',
  templateUrl: './detail-img.component.html',
  styleUrls: ['./detail-img.component.scss'],
})
export class DetailImgComponent implements OnInit, OnChanges {
  @ViewChild('slider', { static: true }) sliderImg: ElementRef | undefined;

  @ViewChild('down')
  imgToDown!: ElementRef;
  @Input()
  srcMain!: string;

  @ViewChild('zoomBox') zoomBox: ElementRef | undefined;
  zoomActive: boolean = false;

  // @ViewChild('.image-zoom-box') zoomBox: ElementRef | undefined; // Agregar ViewChild para la lupa

  @Input() images: string[] = [
    '/assets/64de7c_5c0ba351459045d582cf3f4215ee9229~mv2.webp',
    '/assets/64de7c_5c0ba351459045d582cf3f4215ee9229~mv2.webp',
    '/assets/64de7c_5c0ba351459045d582cf3f4215ee9229~mv2.webp',
    '/assets/64de7c_5c0ba351459045d582cf3f4215ee9229~mv2.webp',
    '/assets/64de7c_5c0ba351459045d582cf3f4215ee9229~mv2.webp',
    '/assets/64de7c_5c0ba351459045d582cf3f4215ee9229~mv2.webp',
  ];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].currentValue) {
    } else {
      this.srcMain = '';
    }
  }

  currentIndex: number = 0; // Inicializa el índice de la imagen actual en 0


  ngOnInit(): void {
    if (this.images.length > 0) {
      this.srcMain = this.images[0];
    }

    const zoomedImg = document.getElementById("zoomed-img");
    const zoomedContainer = document.querySelector(".image-zoom-container");

    if (zoomedImg && zoomedContainer instanceof HTMLElement) {
      zoomedContainer.addEventListener("mousemove", (e: MouseEvent) => {
        const containerRect = zoomedContainer.getBoundingClientRect();
        const x = (e.clientX - containerRect.left) / containerRect.width;
        const y = (e.clientY - containerRect.top) / containerRect.height;

        if (zoomedImg) {
          zoomedImg.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        }
      });

      zoomedContainer.addEventListener("mouseenter", () => {
        if (zoomedImg) {
          zoomedImg.classList.add("zoomed");
        }
      });

      zoomedContainer.addEventListener("mouseleave", () => {
        if (zoomedImg) {
          zoomedImg.classList.remove("zoomed");
        }
      });
    }
  }


  toogleImg(url: string, index: number): void {
    // debugger
    this.srcMain = url;
    this.currentIndex = index;
  }

  up(): void {
    this.sliderImg!.nativeElement.scrollTop -= 80;
  }

  down(): void {
    this.sliderImg!.nativeElement.scrollTop += 80;
  }


}
