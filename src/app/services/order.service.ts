import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { UserService } from './user.service';
import { Product } from '../classes/Product';

@Injectable()
export class OrderService {
  public displayTypeChoosen:number = 1;
  public displayQuantity:number = 1;
  public topSign:number = null;
  public costcentre:number;
  public productChoosen:Product = {
    id: 901,
    title: "Universal Display low base",
    DFID: "DF1015",
    empty_display: 0,
    display_id: 190,
    SAP: "9800111F",
    product_tree: 1,
    topsign_id: 1,
    promotion_material_id: 0,
    price: 25.00,
    deliverytime: 5,
    image: 0,
    hide:0,
    base_display_template_id: 1,
    path: {
      id: 1,
      path: "¼ Pallet filled",
      pathbyid: 1
    },
    article: [
      { position: 901,
        article_id: 615,
        units: 14,
        id: 615,
        articlenr: 34565001,
        title: "GRT 800 THM Brause AP + Brs.garn.",
        extra: "",
        type: "Shower",
        packaging: "carton",
        weight: 3025,
        height: 80,
        width: 150,
        depth: 980,
        topsign: 0,
        deleted: 0,
        old_system: 0
      } ],
      display_parts: [
        { id: 98001352,
          title: "Sockelblende niedrig (0340922-BL2-02 inkl. SK-Band",
          articlenr: 98001503,
          image: 19,
          hide: "",
          displaytype: "1_4_chep_pallet",
          base_display_template_id: 1,
          topsign_punch: "",
          instruction: 3,
          old_system: 0,
          display_id: 190,
          part_id: 98001352,
          units: 1,
          length: "n/a",
          width: 565,
          height: 185,
          stock: 0,
          weight: 199,
          deleted: 0
        },
        { id: 98001358,
          title: "Stülper (0340922-HF1-01) - ohne Druck",
          articlenr: 98001540,
          image: 19,
          hide: "",
          displaytype: "1_4_chep_pallet",
          base_display_template_id: 1,
          topsign_punch: "",
          instruction: 3,
          old_system: 0,
          display_id: 190,
          part_id: 98001358,
          units: 1,
          length: 386,
          width: 588,
          height: 1173,
          stock: 0,
          weight: 1722,
          deleted: 0
        },
          {
            id: 98001361,
            title: "Mantel (0340922-MN-02) - 1/1 - fbg. Flexo + Glanzl",
            articlenr: 98001508,
            image: 19,
            hide: "",
            displaytype: "1_4_chep_pallet",
            base_display_template_id: 1,
            topsign_punch: "",
            instruction: 3,
            old_system: 0,
            display_id: 190,
            part_id: 98001361,
            units: 1,
            length: 365,
            width: 575,
            height: 1170,
            stock: 0,
            weight: 1524,
            deleted: 0
          },
          {
            id: 98001363,
            title: "1/4 wooden pallet",
            articlenr: 98001242,
            image: 19,
            hide: "",
            displaytype: "1_4_chep_pallet",
            base_display_template_id: 1,
            topsign_punch: "",
            instruction: 3,
            old_system: 0,
            display_id: 190,
            part_id: 98001363,
            units: 1,
            length: 200,
            width: 300,
            height: "n/a",
            stock: 0,
            weight: 2400,
            deleted: 0 } ] };
  public SAP:string = "12345678";


  constructor(
    private data:DataService,
    public user: UserService
  ) {
    if(this.user.isLoggedIn){
      this.costcentre = this.user.data.costcentres[0].id;
    }
    else{
      this.user.loggedInStateObserver.subscribe(loggedIn => {
        this.costcentre = this.user.data.costcentres[0].id;
      });
    }

  }
}
