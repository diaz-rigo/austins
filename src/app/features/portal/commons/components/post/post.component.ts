
// }
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  isScrolled: boolean = false;
  showBackground: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 3000;  // Ajusta el valor según sea necesario

    const specialEventsElement = document.querySelector('.special-events') as HTMLElement;
    if (specialEventsElement) {
      const rect = specialEventsElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.showBackground = topShown && bottomShown;
    }
  }
  posters = [
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721381925/public__/luiugqqunycrkhwrmxy5.jpg',
      alt: 'Repostería',
      title: 'Repostería Deliciosa 🥐',
      description: 'Descubre nuestra selección de repostería recién horneada.'
    },
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721381645/public__/ug83laufyyjun0fql4a8.jpg',
      alt: 'Pan',
      title: 'Pan Fresco 🍞',
      description: 'Disfruta la frescura en cada mordisco de nuestro pan casero.'
    },
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721382179/public__/taazwyfpzs1feyirjwwx.jpg',
      alt: 'Pasteles',
      title: 'Pasteles Dulces 🍰',
      description: 'Deléitate con nuestra variedad de pasteles dulces y deliciosos.'
    },
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721382253/public__/ak0o5sohizbe03ptktc8.jpg',
      alt: 'Galletas',
      title: 'Galletas Artesanales 🍪',
      description: 'Disfruta de la perfecta mezcla de crujiente y sabor con nuestras galletas.'
    },
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721382319/public__/gnub0dut8fle8rbfrlk4.jpg',
      alt: 'Ingredientes',
      title: 'Ingredientes de Calidad 🥖',
      description: 'Usamos solo ingredientes de la más alta calidad para todos nuestros productos horneados.'
    }
  ];
  specialEvents = [
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721386736/public__/qoiwohvc5oydr9ultmhc.jpg',
      title: 'Día de las Madres',
      description: 'Celebra a mamá con nuestra selección especial de repostería fina.',
      backgroundColor: '#FFB6C1' // Tonalidad de rosa pastel
    },
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721386735/public__/dhq805ynvoqnga1q024m.jpg',
      title: 'Navidad',
      description: 'Disfruta de nuestras delicias navideñas en esta temporada festiva.',
      backgroundColor: '#FFDAB9' // Tonalidad de dorado pastel
    },
    {
      img: 'https://res.cloudinary.com/dfd0b4jhf/image/upload/v1721386736/public__/d3glt94rlyjbk7o2hclv.jpg',
      title: 'San Valentín',
      description: 'Endulza tu día con nuestros pasteles y postres especiales para San Valentín.',
      backgroundColor: '#FFE4B5' // Tonalidad de rojo pastel
    }
  ];

}
