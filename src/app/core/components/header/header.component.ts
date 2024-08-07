import { SidebarServiceService } from './../../../shared/services/sidebar-service.service';
import { UserStateService } from '../../../features/admin/commons/services/user-state.service' //
import { AuthStateService } from './../../../features/auth/commons/services/auth-state.service'
import { NavigationEnd, Router } from '@angular/router'
import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { SearchService } from 'src/app/shared/services/search-service.service'
import { ActivatedRoute } from '@angular/router'
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog'
import { SignInView } from 'src/app/features/auth/views/sign-in/sign-in.view'
import { CartService } from '../../services/cart.service'
import { SessionService } from '../../services/session.service'
import { Sidebar } from 'primeng/sidebar'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { StorageService } from '../../services/storage.service'
import { CartItem } from 'src/app/shared/models/cart.model'
import { Product } from 'src/app/features/admin/models/Product.models'
import { ConfirmationService, MessageService } from 'primeng/api'
import { PedidoviewService } from 'src/app/shared/services/pedidoview.service'
import { OrderService } from 'src/app/features/payment/commons/services/order.service'
import { ActivateCountComponent } from 'src/app/features/auth/views/activate-count/activate-count.component'
import { ActivateCountByHomeComponent } from 'src/app/features/auth/views/activate-count-by-home/activate-count-by-home.component'
import { DialogRefService } from 'src/app/shared/services/dialog-ref.service'
import { ProfileComponent } from 'src/app/core/components/profile/profile.component'
import { UserProfile } from 'src/app/shared/models/userPROFILE.model'
import { ProfileService } from 'src/app/shared/services/profile.service'
interface EventItem {
  status?: string
  date?: string
  icon?: string
  color?: string
  image?: string
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
    './header.component0.scss',
    './head02.scss',
    './head03.scss',
    './head04.scss',
    './head05.scss',
    './filter.scss',
    './carrito.scss',
    './header.component02.scss',
    './busquedaBy_code.scss',
  ],
  styles: [
    `
      :host {
        @keyframes slidedown-icon {
          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(20px);
          }

          100% {
            transform: translateY(0);
          }
        }

        .slidedown-icon {
          animation: slidedown-icon;
          animation-duration: 3s;
          animation-iteration-count: infinite;
        }

        .box {
          background-image: radial-gradient(
            var(--primary-300),
            var(--primary-600)
          );
          border-radius: 50% !important;
          color: var(--primary-color-text);
        }
      }
    `,
  ],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class HeaderComponent implements OnInit {
  userName: string | undefined
  foto: string | undefined
  isHeaderScrolled = false
  searchQuery: string = ''
  badge: number = 0
  totalAmount!: number
  date: Date | undefined
  hora: Date | undefined

  isMobileMenuOpen: boolean = false
  // carData: CartItem[] = []; // Aquí asignamos el array de elementos del carrito
  @Input() carData: CartItem[] = [] // Recibe los datos del carrito desde el componente padre
  @Input() product!: Product
  visible: boolean = false

  // sidebarVisible: boolean = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar

  closeCallback(e: Event): void {
    this.sidebarRef.close(e)
  }
  ref: DynamicDialogRef | undefined

  sidebarVisible: boolean = false
  sidebarVisible2: boolean = false
  sidebarVisible3: boolean = false
  sidebarVisible4: boolean = false
  mostrardatos: boolean = false
  mostrardatos2: boolean = false
  perfil: boolean = false
  compras: boolean = false
  pedidos: boolean = false

  selectedCategory: string = 'pasteleria'
  selectedColor: string = '#ffffff' // Color inicial
  rangeValues: number[] = [20, 80]
  currentRoute!: string
  // constructor(private pedidoviewService: PedidoviewService) {}
  //
  pedidoInfo: any
  pedidoInfo2: any
  // events = []; // Aquí deberías tener los datos para alimentar el timeline

  events: EventItem[]

  codigoPedido: string = ''
  user: UserProfile | undefined;
  constructor(
    private SidebarServiceService: SidebarServiceService,
    private pedidoviewService: PedidoviewService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private searchService: SearchService,
    private cartService: CartService,
    private router: Router,
    private userStateService: UserStateService,
    private AuthStateService: AuthStateService,
    private sessionService: SessionService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private dialogRefService: DialogRefService,    private profileService: ProfileService,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log('Ruta actual:', event.url);
        this.currentRoute = event.url
      }
    })
    this.cartService.itemsInCart.subscribe((value) => {
      this.badge = value
    })
    // Suscripción al servicio CartService para obtener los datos del carrito
    this.cartService.cartItems$.subscribe((items) => {
      this.carData = items
    })
    this.events = [
      {
        status: 'Ordered',
        date: '15/10/2020 10:30',
        icon: 'pi pi-shopping-cart',
        color: '#9C27B0',
        image: 'game-controller.jpg',
      },
      {
        status: 'Processing',
        date: '15/10/2020 14:00',
        icon: 'pi pi-cog',
        color: '#673AB7',
      },
      {
        status: 'Shipped',
        date: '15/10/2020 16:15',
        icon: 'pi pi-shopping-cart',
        color: '#FF9800',
      },
      {
        status: 'Delivered',
        date: '16/10/2020 10:00',
        icon: 'pi pi-check',
        color: '#607D8B',
      },
    ]
  }

  consultarPedido() {
    // console.log(this.codigoPedido)
    if (this.codigoPedido.trim() !== '') {
      this.orderService.consultarPedido(this.codigoPedido).subscribe(
        (response) => {
          // console.log(response);

          // Verificar la estructura de la respuesta
          if ('resultado' in response && 'codigoPedido' in response.resultado) {
            this.pedidoInfo = response
            this.mostrardatos = true
            this.mostrardatos2 = false
            // Estructura 1
            // this.renderStructure1();
          } else if ('resultado' in response && '_id' in response.resultado) {
            this.mostrardatos2 = true
            this.mostrardatos = false
            this.pedidoInfo2 = response
            // Estructura 2
            // this.renderStructure2();
          } else {
            console.error('Estructura de respuesta desconocida')
            // Puedes manejar este caso como desees
          }
        },
        (error) => {
          console.error('Error al consultar pedido:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Eliminado',
            detail: `"${error.error}" `,
            life: 3000,
          })
          // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
        },
      )
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'vacío',
        detail: `"El código del pedido está vacío" `,
        life: 3000,
      })
      console.warn('El código del pedido está vacío')
      // Aquí puedes mostrar un mensaje al usuario indicando que debe ingresar un código
    }
  }

  fetchUserData(userId: string) {
    this.profileService.getUserById(userId).subscribe(
      (data: UserProfile) => {
        this.user = data;
        this.foto=this.user.profilePhoto
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
  ngOnInit(): void {
    this.SidebarServiceService.sidebarVisible2$.subscribe(visible => {
      const carDataFromStorage = this.storageService.getCarrito()

      // Asignar los datos del carrito al arreglo carData
      if (carDataFromStorage) {
        this.carData = carDataFromStorage
      }
      this.sidebarVisible2 = visible;
    });
    const userData = this.sessionService.getUserData()
    // const carData = this.storageService.getCarrito();
    // this.carData = this.storageService.getCarrito();

    // console.log(this.carData);
    // console.log(this.sidebarVisible2);
    if (userData) {
      this.userName = userData.name
      this.fetchUserData(userData.id);
      // console.log( userData)
    }
    this.cartService.itemsInCart.subscribe((value) => {
      this.badge = value
    })

    // Obtener los datos del carrito desde algún servicio o almacenamiento local
    const carDataFromStorage = this.storageService.getCarrito()

    // Asignar los datos del carrito al arreglo carData
    if (carDataFromStorage) {
      this.carData = carDataFromStorage
      this.badge = this.carData.length // Actualizar el contador badge

      // this.cartService.itemsInCart.subscribe((value) => {
      //   this.badge = value;
      // });
    }
    this.cartService.totalPrice$.subscribe((totalPrice) => {
      this.totalAmount = totalPrice
    })

    // console.log('Datos del carrito:', this.carData);
    const isAuthenticated = this.sessionService.isAutenticated()
  }
  logout(): void {
    // Elimina el token de autenticación del almacenamiento local
    // this.sessionService.removeToken(); // Si ya tienes un método removeToken en tu servicio, úsalo
    localStorage.removeItem('token') // O elimina directamente el token del almacenamiento local aquí

    // Navega a la ruta principal ('/')
    this.router.navigate(['/']).then(() => {
      // Recarga la página después de navegar a la ruta principal
      window.location.reload()
    })
  }
  onSearchChange(query: string) {
    // Llama al servicio para establecer la consulta de búsqueda en tiempo real.
    this.searchService.setSearchQuery(query)
  }

  search(): void {
    if (this.searchQuery) {
      // Llama al servicio para establecer la consulta de búsqueda.
      this.searchService.setSearchQuery(this.searchQuery)
    }
  }
  get shouldShowHeader(): boolean {
    return (
      !this.AuthStateService.getisAuthS() &&
      !this.userStateService.getIsAdminSection()
    )
  }

  redirectTo(route: string): void {
    this.sidebarVisible = false
    this.router.navigate(['/portal', route]) // Utiliza la navegación de Angular
  }

  redirectTo_adm(route: string): void {
    // this.sidebarVisible = false;
    this.router.navigate(['/admin', route]) // Utiliza la navegación de Angular
  }
  redirectTo_Auth(route: string): void {
    this.router.navigate(['/auth', route]) // Utiliza la navegación de Angular
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 0) {
      this.isHeaderScrolled = true
    } else {
      this.isHeaderScrolled = false
    }
  }

  get isAdminSection(): boolean {
    return this.userStateService.getIsAdminSection()
  }

  goToCart(): void {
    const carDataFromStorage = this.storageService.getCarrito()

    // Asignar los datos del carrito al arreglo carData
    if (carDataFromStorage) {
      this.carData = carDataFromStorage
    }

    // console.log('Datos del carrito:', this.carData);
    this.sidebarVisible2 = true

    // debugger
    // this.router.navigateByUrl('/payment/cart');
  }
  closeToCart(): void {
    const carDataFromStorage = this.storageService.getCarrito()

    // Asignar los datos del carrito al arreglo carData
    if (carDataFromStorage) {
      this.carData = carDataFromStorage
    }

    // console.log('Datos del carrito:', this.carData);
    this.sidebarVisible2 = false
    // debugger
    // this.router.navigateByUrl('/payment/cart');
  }

  // isRUTA_DISTINTE_ahome(): boolean {
  //   // Utiliza el evento de cambio de ruta para actualizar 'currentRoute'
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       this.currentRoute = event.url;
  //       // Llamamos a la función que manejará la visibilidad de la sección de filtros
  //       this.handleFilterSectionVisibility();
  //     }
  //   });

  //   // Ahora verifica si la ruta actual es '/portal/home'
  //   return (
  //     this.currentRoute === '/portal/home' ||
  //     this.currentRoute === '/auth/sign-up' ||  this.currentRoute === '/portal/detail'||  this.currentRoute === '/portal/detail/:id'
  //   );
  // }
  // isRUTA_DISTINTE_ahome(): boolean {
  //   // Utiliza el evento de cambio de ruta para actualizar 'currentRoute'
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       this.currentRoute = event.url;
  //       // Llamamos a la función que manejará la visibilidad de la sección de filtros
  //       this.handleFilterSectionVisibility();
  //     }
  //   });

  //   // Ahora verifica si la ruta actual es '/portal/home'
  //   return (
  //     this.currentRoute === '/portal/home' ||
  //     this.currentRoute === '/auth/sign-up'
  //   );
  // }
  isRUTA_DISTINTE_ahome(): boolean {
    return this.currentRoute === '/portal/home'
  }
  isruta_orderdetail(): boolean {
    this.currentRoute = this.router.url

    // Utiliza el evento de cambio de ruta para actualizar 'currentRoute'
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
      }
    })

    // Ahora verifica si la ruta actual incluye '/payment/order-detail'
    // return this.currentRoute.startsWith('/payment/order-detail');
    // return this.currentRoute === '/payment/order-detail/'
    return this.currentRoute.startsWith('/payment/order-detail')
  }

  // Nueva función para manejar la visibilidad de la sección de filtros
  private handleFilterSectionVisibility(): void {
    // Obtenemos la referencia del elemento de la sección de filtros
    const filterSection = document.querySelector('.filter-section')

    // Verificamos si existe el elemento y si la ruta actual es diferente de '/portal/home'
    if (filterSection && this.currentRoute !== '/portal/home') {
      // Añadimos la clase is-detail-route si la ruta no es '/portal/home'
      filterSection.classList.add('is-detail-route')
    } else {
      // Quitamos la clase is-detail-route si la ruta es '/portal/home'
      filterSection?.classList.remove('is-detail-route')
    }
  }

  openSignInModal(): void {
    this.sidebarVisible = false
    const isMobile = window.innerWidth < 480

    this.ref = this.dialogService.open(SignInView, {
      height: isMobile ? 'auto' : 'auto',
      style: {
        'max-width': isMobile ? '110vw' : 'auto',
        'max-height': isMobile ? 'auto' : '100vh',
        padding: '0', // Aquí estableces el padding a 0
      },
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '100vw',
      },

      data: {},
    })
  }

  openActivateCount(): void {
    this.sidebarVisible = false
    const isMobile = window.innerWidth < 480
    this.dialogRefService.setDialogRef(
      (this.ref = this.dialogService.open(ActivateCountByHomeComponent, {
        height: isMobile ? 'auto' : 'auto',
        style: {
          'max-width': isMobile ? '110vw' : 'auto',
          'max-height': isMobile ? 'auto' : '100vh',
          padding: '0', // Aquí estableces el padding a 0
        },
        modal: true,
        breakpoints: {
          '960px': '75vw',
          '640px': '100vw',
        },

        data: {},
      })),
    )
  }

  get cartItem(): CartItem {
    return this.setCartItem()
  }
  setCartItem(): CartItem {
    // console.log('set car', this.product);
    const cartItem: CartItem = {
      id: this.product._id,
      name: this.product.name,
      precio: this.product.price,
      cantidad: 1,
      image: this.product.images,
    }
    return cartItem
  }

  incrementQuantity(item: CartItem): void {
    this.cartService.add(item)
    item.cantidad++ // Incrementa la cantidad del artículo en el carrito
  }
  decrementQuantity(item: CartItem): void {
    // Decrementa la cantidad del artículo en el carrito si es mayor que 1
    if (item.cantidad > 1) {
      item.cantidad--
    }

    // Luego, puedes llamar al servicio para actualizar el carrito, si es necesario
    this.cartService.decre(item)
  }
  confirm2(event: Event, item: CartItem) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que quieres eliminar este elemento?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Eliminado',
          detail: `El producto "${item.name}" ha sido eliminado del carrito`,
          life: 3000,
        })
        // console.log(item);
        this.removeItem(item)
      },
      reject: () => {},
    })
  }

  // removeItem(item: CartItem): void {
  //   // Elimina el artículo del carrito
  //   const index = this.carData.indexOf(item);
  //   console.log("Index:", index);
  //   if (index !== -1) {
  //     this.carData.splice(index, 1);
  //   }
  //   // Luego, puedes llamar al servicio para actualizar el carrito
  //   this.cartService.remove(item);
  // }
  removeItem(item: CartItem): void {
    // Actualiza el carrito para reflejar los cambios en this.carData
    this.carData = this.carData.slice()

    // Elimina el artículo del carrito
    const index = this.carData.indexOf(item)
    if (index !== -1) {
      this.carData.splice(index, 1)
    }

    // Luego, puedes llamar al servicio para actualizar el carrito
    this.cartService.remove(item)
  }


  getTotalAmount(): number {
    return this.carData.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0,
    ) // Calcula el importe total del carrito
  }

  finishPurchase(): void {
    this.sidebarVisible2 = false
    const carDataFromStorage = this.storageService.getCarrito()

    // Asignar los datos del carrito al arreglo carData
    if (carDataFromStorage) {
      this.carData = carDataFromStorage
    }

    // console.log('Datos del carrito:', this.carData);

    // debugger
    this.router.navigateByUrl('/payment/order-detail')
    // Lógica para finalizar la compra
  }

  closeSidebar(): void {
    // Lógica para cerrar la barra lateral y continuar comprando
  }

  applyFilters() {
    // Aquí puedes implementar la lógica para aplicar los filtros
    // console.log('Categoría seleccionada:', this.selectedCategory);
    // console.log('Precio seleccionado:', this.selectedPrice);
    // console.log('Color seleccionado:', this.selectedColor);
    // Implementa la lógica para filtrar los productos según las selecciones
  }

  // visible: boolean = false;

  // position: string = '';

  // showDialog(position: string) {
  //   this.position = position;
  //   this.visible = true;
  // }

  // isVisible$ = this.pedidoviewService.visible$;
  isVisible$ = this.pedidoviewService.visible$

  // constructor(private pedidoviewService: PedidoviewService) {}

  showDialog() {
    this.pedidoviewService.showDialog()
  }

  hideDialog() {
    this.pedidoviewService.hideDialog()
  }

  // abreperil() {
  //   // this.perfil = true
  //   const isMobile = window.innerWidth < 480
  //   this.dialogRefService.setDialogRef(
  //     (this.ref = this.dialogService.open(ProfileComponent, {
  //       height: isMobile ? 'auto' : 'auto',
  //       style: {
  //         'max-width': isMobile ? '110vw' : 'auto',
  //         'max-height': isMobile ? 'auto' : '100vh',
  //         padding: '0', // Aquí estableces el padding a 0
  //       },
  //       modal: true,
  //       breakpoints: {
  //         '960px': '75vw',
  //         '640px': '100vw',
  //       },

  //       data: {},
  //     })),
  //   )
  // }
  abreperil() {
    this.perfil = true
  }
  abreCompra() {
    this.compras = true
  }
  abrePedido() {
    this.pedidos = true
  }
  // abreperil() {
  //   // this.perfil = true
  //   const isMobile = window.innerWidth < 480
  //   this.dialogRefService.setDialogRef(
  //     (this.ref = this.dialogService.open(ProfileComponent, {
  //       height: isMobile ? 'auto' : 'auto',
  //       style: {
  //         'max-width': isMobile ? '110vw' : 'auto',
  //         'max-height': isMobile ? '100vh' : '100vh',
  //         padding: '0', // Aquí estableces el padding a 0
  //       },
  //       modal: true,
  //       breakpoints: {
  //         '960px': '75vw',
  //         '640px': '100vw',
  //       },

  //       data: {},
  //     })),
  //   )
  // }

}
