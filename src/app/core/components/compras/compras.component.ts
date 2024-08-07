import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { SessionService } from '../../services/session.service';
import { UserProfile } from 'src/app/shared/models/userPROFILE.model';
import { ProductService } from 'src/app/features/admin/commons/services/product.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { StripeService } from 'src/app/features/payment/commons/services/stripe.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss'],
})
export class ComprasComponent implements OnInit, OnDestroy {
  compras: any[] = [];
  user: UserProfile | undefined;
  pollingSubscription: Subscription | undefined;

  constructor(
    private comprasService: ProfileService,
    private productService: ProductService,
    private stripeService: StripeService,
    private headerComponent: HeaderComponent,
    private sessionService: SessionService,
    private router: Router
  ) {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.fetchUserData(userData.id);
      this.loadCompras(userData.id);
    }
  }

  ngOnInit(): void {
    const userData = this.sessionService.getUserData();
    if (userData) {
      // Inicia el polling cada 30 segundos
      this.pollingSubscription = interval(30000).subscribe(() => {
        this.loadCompras(userData.id);
      });
    }
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción de polling cuando el componente se destruya
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  fetchUserData(userId: string) {
    this.comprasService.getUserById(userId).subscribe(
      (data: UserProfile) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  loadCompras(userId: string) {
    this.comprasService.getCompras(userId).subscribe(
      (data) => {
        this.compras = data;
        this.loadProductDetails();
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
  }

  loadProductDetails() {
    const productIds = this.compras.flatMap((compra) =>
      compra.details.flatMap((detail: { products: any[] }) =>
        detail.products.map((product) => product.product)
      )
    );

    this.productService.getMultipleByIds(productIds).subscribe(
      (productData) => {
        this.compras.forEach((compra) => {
          compra.details.forEach((detail: { products: any[] }) => {
            detail.products.forEach((product) => {
              const productDetail = productData.find(
                (p) => p._id === product.product
              );
              product.details = productDetail;
            });
          });
        });
      },
      (error) => {
        console.error('Error al obtener datos del producto:', error);
      }
    );
  }
  redirectTo(route: string): void {
    // Ocultar compras con un pequeño retraso
    setTimeout(() => {
      this.headerComponent.compras = false;
    }, 0); // Ejecuta inmediatamente

    // Ocultar la barra lateral con un pequeño retraso
    setTimeout(() => {
      this.headerComponent.sidebarVisible = false;
    }, 500); // Ejecuta después de 500ms

    // Desplazarse a la sección de productos con un pequeño retraso
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000); // Ejecuta después de 1000ms

    // Navegar a la nueva ruta con un pequeño retraso
    setTimeout(() => {
      this.router.navigate(['/portal', route]);
    }, 1500); // Ejecuta después de 1500ms
  }

  pagar(compra: any) {
    if (confirm('¿Estás seguro de que quieres proceder con el pago?')) {
      const purchaseData = {
        totalneto: parseFloat(compra.totalAmount).toFixed(2),
        tipoEntrega: compra.details[0].deliveryType || 'En tienda',
        dateselect: compra.details[0].deliveryDate ? new Date(compra.details[0].deliveryDate).toISOString().split('T')[0] : '',
        productos: compra.details[0].products.map((product: { product: any; details: { name: any; images: any[]; price: any }; quantity: any }) => ({
          id: product.product,
          name: product.details.name,
          image: product.details.images[0],
          precio: product.details.price,
          cantidad: product.quantity,
        })),
        datoscliente: {
          name: this.user?.name || 'Nombre del Cliente',
          paternalLastname: this.user?.paternalLastname || 'Apellido Paterno',
          maternalLastname: this.user?.maternalLastname || 'Apellido Materno',
          phone: this.user?.phone || '555-555-5555',
          email: this.user?.email || 'cliente@example.com',
        },
        instruction: 'Por favor, entregar entre 10 y 11 AM.',
        success_url: 'https://austins.vercel.app/payment/order-success',
        cancel_url: 'https://austins.vercel.app/payment/order-detail',
        codigoDeSeguimiento: compra.trackingNumber
      };

      this.stripeService.createCheckoutSession2(purchaseData).subscribe(
        (response: any) => {
          window.location.href = response.url;
        },
        (error: any) => {
          console.error('Error en el pago con tarjeta:', error);
          alert('Hubo un problema al procesar el pago. Por favor, inténtalo de nuevo más tarde.');
        }
      );
    }
  }
}
