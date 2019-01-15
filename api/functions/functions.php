<?php
function GeneratePassword($length = 8) {
    $char_control  = "";
    $chars_for_pw  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*#";
    $chars_for_pw .= "0123456789*#";

    $chars_for_pw .= "abcdefghijklmnopqrstuvwxyz*#";
    srand((double) microtime() * 1000000);

    for($i=0;$i<$length;$i++) {
        $number = rand(0, strlen($chars_for_pw)-1);
        $char_control .= $chars_for_pw[$number];
    }

    return $char_control;
}
