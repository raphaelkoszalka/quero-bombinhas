import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { BroadcasterService } from '../../services/broadcaster.service';
import { LoggerService } from '../../services/logger.service';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  public indexData: object;
  public backgroundStyles: object;
  public isLoading: boolean;

  constructor(private logger: LoggerService, private http: HttpService, private router: Router,
              private broadcaster: BroadcasterService, private route: ActivatedRoute) {
    this.isLoading = true;
    this.indexData = route['data']['_value']['content'];
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngOnInit() {
    const coverMap: object = {
      0: './assets/covers/ethan-robertson-134952-unsplash-min.jpg',
      1: './assets/covers/clem-onojeghuo-33630-unsplash-min.jpg',
      2: './assets/covers/kees-streefkerk-352781-unsplash-min.jpg',
      3: './assets/covers/biel-morro-326858-unsplash-min.jpg',
      4: './assets/covers/michael-mims-111094-unsplash-min.jpg',
      5: './assets/covers/natalya-zaritskaya-144626-unsplash-min.jpg'
    };

    // cover background styles object to apply with [ngStyle]
    this.backgroundStyles = {
      'background-image': 'url(' + coverMap[HomePageComponent.getRandomInt(0, 5)] + ')',
      'background-size': 'cover',
      '-webkit-background-size': 'cover',
      'background-position': 'center center',
      'background-color': 'lightblue'
    };

    setTimeout( () => {
      this.isLoading = false;
      // not proud of this.
      // @todo: become proud
      // @todo: utilize angular Location service instead of broadcasting events
      this.broadcaster.on<string>('CHECK_QUERY_ARG').subscribe( (el) => this.scrollToElement(el, false));
      this.changeQueryParameterFromCallToAction();
    }, 300);
  }

  public changeQueryParameterFromCallToAction(): void {
    if (this.route.queryParams['_value']['goTo'] === 'imoveis') {
      setTimeout( () =>   this.scrollToElement('estatesRow', false), 150);
    }
  }

  public scrollToElement(el: string, fromCallToAction): void {

    if (fromCallToAction) {
      this.router.navigate(['home'], { queryParams: { goTo: 'imoveis' } });
    }

    if (el === 'estatesRow') {
      document.getElementById(el).style.paddingTop = '110px';
    }

    if (el === 'topOfTheWorld') {
      document.getElementById(el).style.paddingTop = '0px';
    }

    setTimeout( () =>
        document.getElementById(el).scrollIntoView({ block: 'start', behavior: 'smooth' })
      , 100);
  }
}
