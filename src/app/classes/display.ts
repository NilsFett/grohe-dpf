interface DisplayData {
  id: number;
  title: string;
  articlenr: string;
  image: number;
  hide:boolean;
  displaytype:string;
  base_display_template_id:number;
  topsign_punch:string;
  instruction:number;
}

export class Display {
  id:number=null;
  title:string=null;
  articlenr:string=null;
  image:number=null;
  hide:boolean=true;
  displaytype:string="1_4_chep_pallet";
  base_display_template_id:number=0;
  topsign_punch:string=null;
  instruction:number=null;


  constructor(obj?:DisplayData ){
    if(obj){
      this.id = obj.id;
      this.title = obj.title;
      this.articlenr = obj.articlenr;
      this.image = obj.image;
      this.hide = obj.hide;
      this.displaytype = obj.displaytype;
      this.base_display_template_id = obj.base_display_template_id;
      this.topsign_punch = obj.topsign_punch;
      this.instruction = obj.instruction;
    }
  }
}
