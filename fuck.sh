#!/bin/bash

sed -i '' 's/,this._isFinished=!0//' node_modules/web-animations-js/web-animations.min.js
sed -i '' "s/  class:/  'class':/g" node_modules/@angular/material/@angular/material.js
sed -i '' "s/  extends:/  'extends':/" node_modules/intl/lib/core.js
