<?php
    /*
     Copyright (c) 2018 Nils Fett
     
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
     to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
     and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
     INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
     IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
     TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    class cCostNoModel extends cModel{
        
        protected $aColumns = array(
                                    'id' => array(
                                                  'value' => false,
                                                  'type' => 'int'
                                                  ),
                                    'userid' => array(
                                                      'value' => false,
                                                      'type' => 'int'
                                                      ),
                                    'costno' => array(
                                                      'value' => false,
                                                      'type' => 'varchar'
                                                      ),
                                    'description' => array(
                                                           'value' => false,
                                                           'type' => 'varchar'
                                                           )
                                    );
        static $sTable = 't_costno';
        protected $sPrimary = 'id';
        
        public function __construct($aData = false){
            parent::__construct($aData);
        }
        
        public static function getByUserId($userId){
            $query = 'SELECT * FROM t_costno WHERE userid = "'.$userId.'"';
            $db = cDatabase::getInstance();
            $hRessource = $db->hConnection->query($query);
            $row = $hRessource->fetch();
            if($row){
                return new cCostNoModel($row);
            }
            else{
                return false;
            }
        }
        
        public static function replaceCostno($userId, $costNo, $description){
            $query = '    REPLACE INTO `'.self::$sTable.'`
            SET `userid` = ?, `description` = ?, `costno` = ?';
            $db = cDatabase::getInstance();
            $stmt = $db->hConnection->prepare($query);
            $stmt->execute(array($userId, $description, $costNo));
        }
    }
