import { Display } from './display';

export abstract class displayTemplates {
  public static displayTemplates = [
    {
      display: (new Display (
        {
          id:null,
          title:'Manteldisplay mit niedrigem Sockel für Duschsysteme',
          articlenr:'9800111F',
          image:19,
          hide:false,
          displaytype:"1_4_chep_pallet",
          base_display_template_id:1,
          topsign_punch:'',
          instruction:3
        })),
      parts:[{
        articlenr:98001242,
        units:1
      },{
        articlenr:98001508,
        units:1
      },{
        articlenr:98001503,
        units:1
      },{
        articlenr:98001540,
        units:1
      }]
      }, {
      display:(new Display ({
          id:null,
          title:'Manteldisplay mit hohem Sockel für Stangensets',
          articlenr:'9800150H',
          image:19,
          hide:false,
          displaytype:"1_4_chep_pallet",
          base_display_template_id:2,
          topsign_punch:'',
          instruction:3
        })
      ),
      parts:[{
        articlenr:98001242,
        units:1
      },{
        articlenr:98001508,
        units:1
      },{
        articlenr:98001502,
        units:1
      },{
        articlenr:98001500,
        units:1
      },{
        articlenr:98001509,
        units:1
      },{
        articlenr:98001205,
        units:1
      },{
        articlenr:98001540,
        units:1
      }]
    },{

    display:(new Display ({
        id:null,
        title:'2 Schüttendisplay',
        articlenr:'9800120S',
        image:21,
        hide:false,
        displaytype:"1_4_chep_pallet",
        base_display_template_id:3,
        topsign_punch:'',
        instruction:3
      })
    ),
    parts:[{
      articlenr:98001242,
      units:1
    },{
      articlenr:98001508,
      units:1
    },{
      articlenr:98001500,
      units:1
    },{
      articlenr:98001502,
      units:1
    },{
      articlenr:98001506,
      units:2
    },{
      articlenr:98001540,
      units:1
    }]
  },{

    display:(new Display ({
        id:null,
        title:'3 Schüttendisplay',
        articlenr:'9800130S',
        image:23,
        hide:false,
        displaytype:"1_4_chep_pallet",
        base_display_template_id:4,
        topsign_punch:'',
        instruction:3
      })
    ),
    parts:[{
      articlenr:98001242,
      units:1
    },{
      articlenr:98001508,
      units:1
    },{
      articlenr:98001501,
      units:1
    },{
      articlenr:98001503,
      units:1
    },{
      articlenr:98001506,
      units:3
    },{
      articlenr:98001540,
      units:1
    }]
  },{

    display:(new Display ({
        id:null,
        title:'leeres Display',
        articlenr:'',
        image:0,
        hide:false,
        displaytype:"1_4_chep_pallet",
        base_display_template_id:0,
        topsign_punch:'',
        instruction:3
      })
    ),
    parts:[]
  }
  ];
}
