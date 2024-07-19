import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductService } from 'src/app/features/admin/commons/services/product.service';
import { Product } from 'src/app/features/admin/models/Product.models';
import { SearchService } from 'src/app/shared/services/search-service.service';
// import 'aos/dist/aos.css';
// import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.views.html',

  styleUrls: [
    './home.views.scss',
    './product.scss',
    './hom.scss',
    './anima.scss',
    './skeleton.scss',
  ],
  // encapsulation: ViewEncapsulation.None,
})
export class HomeViews implements OnInit {
  responsiveOptions: any[] | undefined;
  autoplayInterval: number = 15000;
  // autoplayInterval: number = 9000;
  currentRoute!: string;
  originalProducts: Product[] = []; // Mantén una copia original de todos los productos
  filteredProducts: Product[] = []; // Almacena los productos filtrados para la búsqueda
  hasSearchResults = true;
  filterPost = '';
  items: number = 0;
  // productsLoaded: boolean = false; // Variable para indicar si los productos se han cargado o no
  loadingProducts = true; // Variable para indicar si los productos se están cargando
  isMobile: boolean = false; // Variable para verificar si es una pantalla móvil
  showAnimation: boolean = false;
  showAnimation2: boolean = false;
  private backgroundImageInterval: NodeJS.Timeout | undefined;

  constructor(
    private router: Router,
    private productService: ProductService,
    private searchService: SearchService
  ) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const cursor = document.querySelector('.cursor') as HTMLElement;
    cursor.style.left = event.clientX - 10 + 'px';
    cursor.style.top = event.clientY - 10 + 'px';
  }

  redirectTo(route: string): void {
    console.log('redirect');
    this.router.navigateByUrl('/portal/' + route);
  }
  // ngOnDestroy(): void {
  //   // Elimina el evento de scroll al destruir el componente
  //   window.removeEventListener('scroll', this.onWindowScroll);
  // }
  ngOnDestroy(): void {
    // Elimina el evento de scroll al destruir el componente
    window.removeEventListener('scroll', this.onWindowScroll);
    // Detener el intervalo de cambio de imagen de fondo
    clearInterval(this.backgroundImageInterval);
}
  // Método para manejar el evento de scroll
  onWindowScroll = (): void => {
    // Obtiene la posición actual del scroll
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Verifica si la posición del scroll es mayor a 400
    if (scrollPosition > 530) {
      this.showAnimation = true;
    } else {
      this.showAnimation = false;
    }
    if (scrollPosition > 930) {
      this.showAnimation2 = true;
    } else {
      this.showAnimation2 = false;
    }
  };
  isRUTA_DISTINTE_ahome(): boolean {
    // Utiliza el evento de cambio de ruta para actualizar 'currentRoute'
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        // Llamamos a la función que manejará la visibilidad de la sección de filtros

      }
    });

    // Ahora verifica si la ruta actual es '/portal/home'
    return (
      this.currentRoute === '/portal/home'
    );
  }
  private setupBackgroundImageInterval(): void {
    this.backgroundImageInterval = setInterval(() => {
        this.changeBackgroundImage();
    }, 5000); // Cambiar cada 5 segundos (ajusta este valor según sea necesario)
}
  ngOnInit(): void {
    window.addEventListener('scroll', this.onWindowScroll);
    // this.loadingProducts = true; // Establece loadingProducts en true mientras se cargan los productos
    this.setupBackgroundImageInterval();

    // Configurar el intervalo para cambiar la imagen de fondo
    // setInterval(() => {
    //   this.changeBackgroundImage();
    // }, 5000); // Cambiar cada 5 segundos (ajusta este valor según sea necesario)

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    // Verificar el tamaño de la pantalla al cargar el componente
    this.checkScreenSize();

    // Suscribirse a cambios en la búsqueda
    this.searchService.searchQuery$.subscribe((query) => {
      this.filterPost = query;
      this.filterProducts(query);
    });

    // Obtener todos los productos
    this.productService.getAll().subscribe(
      (response) => {
        // Simular un tiempo de carga del skeleton antes de mostrar los productos reales
        this.loadingProducts = true; // Establece loadingProducts en false una vez que los productos se han cargado
        setTimeout(() => {
          this.originalProducts = response;
          if (this.originalProducts.length < 0) {
            this.reloadPage()
          }
            this.loadingProducts = false; // Establece loadingProducts en false una vez que los productos se han cargado

          this.filterProducts(this.filterPost); // Filtra los productos basados en la búsqueda actual
        }, 2000); // Cambiar a la cantidad de tiempo deseado para mostrar el skeleton (en milisegundos)
      },
      (error) => {
        console.log('Error al cargar productos', error);
        this.loadingProducts = false; // Establece loadingProducts en false en caso de error al cargar los productos
      }
    );
  }
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Especifica un tiempo en milisegundos antes de la recarga
  }
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 800;
  }

  filterProducts(query: string): void {
    if (query.trim() !== '') {
      this.filteredProducts = this.originalProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.originalProducts];
    }
    this.hasSearchResults = this.filteredProducts.length > 0;
  }
  // "C:\myAngular\austins\src\assets\385875277_803282551806512_7717989195696097860_n.jpg"
  // Método para generar items de esqueleto
  get skeletonItems(): any[] {
    const skeletonItemCount = 4; // Definir la cantidad de items de esqueleto que deseas mostrar
    return Array(skeletonItemCount).fill(null);
  }


    backgroundImages: string[] = [
          'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1709327171/public__/mbpozw6je9mm8ycsoeih.jpg',
          'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1709327171/public__/mbpozw6je9mm8ycsoeih.jpg',
          'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1709327171/public__/mbpozw6je9mm8ycsoeih.jpg',
      'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1709327171/public__/m2z2hvzekjw0xrmjnji4.jpg',
      'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1709327171/public__/m2z2hvzekjw0xrmjnji4.jpg',
      'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1709327171/public__/m2z2hvzekjw0xrmjnji4.jpg',


      // Agrega más URLs de imágenes según sea necesario
    ];
    currentImageIndex = 0;
    // Función para cambiar la imagen de fondo
    changeBackgroundImage() {
      setTimeout(() => {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % this.backgroundImages.length;
      }, this.autoplayInterval);
    }

    scrollToProducts() {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
}
