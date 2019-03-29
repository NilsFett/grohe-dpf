interface DisplayData {
  id: number;
  title: string;
  articlenr: string;
  image: number;
  hide:boolean;
  displaytype:string;
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
      this.topsign_punch = obj.topsign_punch;
      this.instruction = obj.instruction;
    }
  }
}
