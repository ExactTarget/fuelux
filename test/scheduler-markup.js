define(function (require) {
    return '' +
        '<div id="MyScheduler" class="scheduler">' +
            '<table class="scheduler-table">' +
                '<tr class="scheduler-start">' +
                    '<td class="scheduler-label">Start</td>' +
                    '<td>' +
                        '<div class="datepicker dropdown">' +
                            '<div class="input-append">' +
                                '<div class="dropdown-menu"></div>' +
                                '<input type="text" class="span2" value="" data-toggle="dropdown">' +
                                '<button type="button" class="btn" data-toggle="dropdown"><i class="icon-calendar"></i></button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="input-append dropdown combobox">' +
                            '<input class="span2" type="text"><button type="button" class="btn" data-toggle="dropdown"><i class="caret"></i></button>' +
                            '<ul class="dropdown-menu">' +
                                '<li><a href="#">12:00 AM</a></li>' +
                                '<li><a href="#">12:30 AM</a></li>' +
                                '<li><a href="#">1:00 AM</a></li>' +
                                '<li><a href="#">1:30 AM</a></li>' +
                                '<li><a href="#">2:00 AM</a></li>' +
                                '<li><a href="#">2:30 AM</a></li>' +
                                '<li><a href="#">3:00 AM</a></li>' +
                                '<li><a href="#">3:30 AM</a></li>' +
                                '<li><a href="#">4:00 AM</a></li>' +
                                '<li><a href="#">4:30 AM</a></li>' +
                                '<li><a href="#">5:00 AM</a></li>' +
                                '<li><a href="#">5:30 AM</a></li>' +
                                '<li><a href="#">6:00 AM</a></li>' +
                                '<li><a href="#">6:30 AM</a></li>' +
                                '<li><a href="#">7:00 AM</a></li>' +
                                '<li><a href="#">7:30 AM</a></li>' +
                                '<li><a href="#">8:00 AM</a></li>' +
                                '<li><a href="#">8:30 AM</a></li>' +
                                '<li><a href="#">9:00 AM</a></li>' +
                                '<li><a href="#">9:30 AM</a></li>' +
                                '<li><a href="#">10:00 AM</a></li>' +
                                '<li><a href="#">10:30 AM</a></li>' +
                                '<li><a href="#">11:00 AM</a></li>' +
                                '<li><a href="#">11:30 AM</a></li>' +
                                '<li><a href="#">12:00 PM</a></li>' +
                                '<li><a href="#">12:30 PM</a></li>' +
                                '<li><a href="#">1:00 PM</a></li>' +
                                '<li><a href="#">1:30 PM</a></li>' +
                                '<li><a href="#">2:00 PM</a></li>' +
                                '<li><a href="#">2:30 PM</a></li>' +
                                '<li><a href="#">3:00 PM</a></li>' +
                                '<li><a href="#">3:30 PM</a></li>' +
                                '<li><a href="#">4:00 PM</a></li>' +
                                '<li><a href="#">4:30 PM</a></li>' +
                                '<li><a href="#">5:00 PM</a></li>' +
                                '<li><a href="#">5:30 PM</a></li>' +
                                '<li><a href="#">6:00 PM</a></li>' +
                                '<li><a href="#">6:30 PM</a></li>' +
                                '<li><a href="#">7:00 PM</a></li>' +
                                '<li><a href="#">7:30 PM</a></li>' +
                                '<li><a href="#">8:00 PM</a></li>' +
                                '<li><a href="#">8:30 PM</a></li>' +
                                '<li><a href="#">9:00 PM</a></li>' +
                                '<li><a href="#">9:30 PM</a></li>' +
                                '<li><a href="#">10:00 PM</a></li>' +
                                '<li><a href="#">10:30 PM</a></li>' +
                                '<li><a href="#">11:00 PM</a></li>' +
                                '<li><a href="#">11:30 PM</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr class="scheduler-timezone">' +
                    '<td class="scheduler-label">Timezone</td>' +
                    '<td>' +
                        '<div class="btn-group select">' +
                            '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">(GMT-06:00) Central Standard Time</span><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu">' +
                                '<li data-name="Central Standard Time (no DST)" data-offset="-06:00"><a href="#">(GMT-06:00) Central Standard Time</a></li>' +
                                '<li data-name="Morocco Standard Time" data-offset="+00:00"><a href="#">(GMT) Casablanca *</a></li>' +
                                '<li data-name="GMT Standard Time" data-offset="+00:00"><a href="#">(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London *</a></li>' +
                                '<li data-name="Greenwich Standard Time" data-offset="+00:00"><a href="#">(GMT) Monrovia, Reykjavik</a></li>' +
                                '<li data-name="W. Europe Standard Time" data-offset="+01:00"><a href="#">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna *</a></li>' +
                                '<li data-name="Central Europe Standard Time" data-offset="+01:00"><a href="#">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague *</a></li>' +
                                '<li data-name="Romance Standard Time" data-offset="+01:00"><a href="#">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris *</a></li>' +
                                '<li data-name="Central European Standard Time" data-offset="+01:00"><a href="#">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb *</a></li>' +
                                '<li data-name="W. Central Africa Standard Time" data-offset="+01:00"><a href="#">(GMT+01:00) West Central Africa</a></li>' +
                                '<li data-name="Jordan Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Amman *</a></li>' +
                                '<li data-name="GTB Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Athens, Bucharest, Istanbul *</a></li>' +
                                '<li data-name="Middle East Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Beirut *</a></li>' +
                                '<li data-name="Egypt Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Cairo *</a></li>' +
                                '<li data-name="South Africa Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Harare, Pretoria</a></li>' +
                                '<li data-name="FLE Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius *</a></li>' +
                                '<li data-name="Israel Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Jerusalem *</a></li>' +
                                '<li data-name="E. Europe Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Minsk *</a></li>' +
                                '<li data-name="Namibia Standard Time" data-offset="+02:00"><a href="#">(GMT+02:00) Windhoek *</a></li>' +
                                '<li data-name="Arabic Standard Time" data-offset="+03:00"><a href="#">(GMT+03:00) Baghdad *</a></li>' +
                                '<li data-name="Arab Standard Time" data-offset="+03:00"><a href="#">(GMT+03:00) Kuwait, Riyadh</a></li>' +
                                '<li data-name="Russian Standard Time" data-offset="+03:00"><a href="#">(GMT+03:00) Moscow, St. Petersburg, Volgograd *</a></li>' +
                                '<li data-name="E. Africa Standard Time" data-offset="+03:00"><a href="#">(GMT+03:00) Nairobi</a></li>' +
                                '<li data-name="Georgian Standard Time" data-offset="+03:00"><a href="#">(GMT+03:00) Tbilisi</a></li>' +
                                '<li data-name="Iran Standard Time" data-offset="+03:30"><a href="#">(GMT+03:30) Tehran *</a></li>' +
                                '<li data-name="Arabian Standard Time" data-offset="+04:00"><a href="#">(GMT+04:00) Abu Dhabi, Muscat</a></li>' +
                                '<li data-name="Azerbaijan Standard Time" data-offset="+04:00"><a href="#">(GMT+04:00) Baku *</a></li>' +
                                '<li data-name="Caucasus Standard Time" data-offset="+04:00"><a href="#">(GMT+04:00) Caucasus Standard Time</a></li>' +
                                '<li data-name="Mauritius Standard Time" data-offset="+04:00"><a href="#">(GMT+04:00) Port Louis *</a></li>' +
                                '<li data-name="Caucasus Standard Time" data-offset="+04:00"><a href="#">(GMT+04:00) Yerevan</a></li>' +
                                '<li data-name="Afghanistan Standard Time" data-offset="+04:30"><a href="#">(GMT+04:30) Kabul</a></li>' +
                                '<li data-name="Ekaterinburg Standard Time" data-offset="+05:00"><a href="#">(GMT+05:00) Ekaterinburg *</a></li>' +
                                '<li data-name="Pakistan Standard Time" data-offset="+05:00"><a href="#">(GMT+05:00) Islamabad, Karachi *</a></li>' +
                                '<li data-name="West Asia Standard Time" data-offset="+05:00"><a href="#">(GMT+05:00) Tashkent</a></li>' +
                                '<li data-name="India Standard Time" data-offset="+05:30"><a href="#">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</a></li>' +
                                '<li data-name="Sri Lanka Standard Time" data-offset="+05:30"><a href="#">(GMT+05:30) Sri Jayawardenepura</a></li>' +
                                '<li data-name="Nepal Standard Time" data-offset="+05:45"><a href="#">(GMT+05:45) Kathmandu</a></li>' +
                                '<li data-name="N. Central Asia Standard Time" data-offset="+06:00"><a href="#">(GMT+06:00) Almaty, Novosibirsk *</a></li>' +
                                '<li data-name="Central Asia Standard Time" data-offset="+06:00"><a href="#">(GMT+06:00) Astana, Dhaka</a></li>' +
                                '<li data-name="Myanmar Standard Time" data-offset="+06:00"><a href="#">(GMT+06:30) Yangon (Rangoon)</a></li>' +
                                '<li data-name="SE Asia Standard Time" data-offset="+07:00"><a href="#">(GMT+07:00) Bangkok, Hanoi, Jakarta</a></li>' +
                                '<li data-name="North Asia Standard Time" data-offset="+07:00"><a href="#">(GMT+07:00) Krasnoyarsk *</a></li>' +
                                '<li data-name="China Standard Time" data-offset="+08:00"><a href="#">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</a></li>' +
                                '<li data-name="North Asia East Standard Time" data-offset="+08:00"><a href="#">(GMT+08:00) Irkutsk, Ulaan Bataar *</a></li>' +
                                '<li data-name="Singapore Standard Time" data-offset="+08:00"><a href="#">(GMT+08:00) Kuala Lumpur, Singapore</a></li>' +
                                '<li data-name="W. Australia Standard Time" data-offset="+08:00"><a href="#">(GMT+08:00) Perth *</a></li>' +
                                '<li data-name="Taipei Standard Time" data-offset="+08:00"><a href="#">(GMT+08:00) Taipei</a></li>' +
                                '<li data-name="Tokyo Standard Time" data-offset="+09:00"><a href="#">(GMT+09:00) Osaka, Sapporo, Tokyo</a></li>' +
                                '<li data-name="Korea Standard Time" data-offset="+09:00"><a href="#">(GMT+09:00) Seoul</a></li>' +
                                '<li data-name="Yakutsk Standard Time" data-offset="+09:00"><a href="#">(GMT+09:00) Yakutsk *</a></li>' +
                                '<li data-name="Cen. Australia Standard Time" data-offset="+09:30"><a href="#">(GMT+09:30) Adelaide *</a></li>' +
                                '<li data-name="AUS Central Standard Time" data-offset="+09:30"><a href="#">(GMT+09:30) Darwin</a></li>' +
                                '<li data-name="E. Australia Standard Time" data-offset="+10:00"><a href="#">(GMT+10:00) Brisbane</a></li>' +
                                '<li data-name="AUS Eastern Standard Time" data-offset="+10:00"><a href="#">(GMT+10:00) Canberra, Melbourne, Sydney *</a></li>' +
                                '<li data-name="West Pacific Standard Time" data-offset="+10:00"><a href="#">(GMT+10:00) Guam, Port Moresby</a></li>' +
                                '<li data-name="Tasmania Standard Time" data-offset="+10:00"><a href="#">(GMT+10:00) Hobart *</a></li>' +
                                '<li data-name="Vladivostok Standard Time" data-offset="+10:00"><a href="#">(GMT+10:00) Vladivostok *</a></li>' +
                                '<li data-name="Central Pacific Standard Time" data-offset="+11:00"><a href="#">(GMT+11:00) Magadan, Solomon Is., New Caledonia</a></li>' +
                                '<li data-name="New Zealand Standard Time" data-offset="+12:00"><a href="#">(GMT+12:00) Auckland, Wellington *</a></li>' +
                                '<li data-name="Fiji Standard Time" data-offset="+12:00"><a href="#">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</a></li>' +
                                '<li data-name="Tonga Standard Time" data-offset="+12:00"><a href="#">(GMT+13:00) Nukualofa</a></li>' +
                                '<li data-name="Azores Standard Time" data-offset="+12:00"><a href="#">(GMT-01:00) Azores *</a></li>' +
                                '<li data-name="Cape Verde Standard Time" data-offset="-01:00"><a href="#">(GMT-01:00) Cape Verde Is.</a></li>' +
                                '<li data-name="Mid-Atlantic Standard Time" data-offset="-02:00"><a href="#">(GMT-02:00) Mid-Atlantic *</a></li>' +
                                '<li data-name="E. South America Standard Time" data-offset="-03:00"><a href="#">(GMT-03:00) Brasilia *</a></li>' +
                                '<li data-name="Argentina Standard Time" data-offset="-03:00"><a href="#">(GMT-03:00) Buenos Aires *</a></li>' +
                                '<li data-name="SA Western Standard Time" data-offset="-03:00"><a href="#">(GMT-03:00) Georgetown</a></li>' +
                                '<li data-name="Greenland Standard Time" data-offset="-03:00"><a href="#">(GMT-03:00) Greenland *</a></li>' +
                                '<li data-name="Montevideo Standard Time" data-offset="-03:00"><a href="#">(GMT-03:00) Montevideo *</a></li>' +
                                '<li data-name="Newfoundland Standard Time" data-offset="-03:00"><a href="#">(GMT-03:30) Newfoundland *</a></li>' +
                                '<li data-name="Atlantic Standard Time" data-offset="-04:00"><a href="#">(GMT-04:00) Atlantic Time (Canada) *</a></li>' +
                                '<li data-name="SA Western Standard Time" data-offset="-04:00"><a href="#">(GMT-04:00) La Paz</a></li>' +
                                '<li data-name="Central Brazilian Standard Time" data-offset="-04:00"><a href="#">(GMT-04:00) Manaus *</a></li>' +
                                '<li data-name="Pacific SA Standard Time" data-offset="-04:00"><a href="#">(GMT-04:00) Santiago *</a></li>' +
                                '<li data-name="Venezuela Standard Time" data-offset="-04:30"><a href="#">(GMT-04:30) Caracas</a></li>' +
                                '<li data-name="SA Pacific Standard Time" data-offset="-05:00"><a href="#">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</a></li>' +
                                '<li data-name="Eastern Standard Time" data-offset="-05:00"><a href="#">(GMT-05:00) Eastern Time (US &amp; Canada) *</a></li>' +
                                '<li data-name="US Eastern Standard Time" data-offset="-05:00"><a href="#">(GMT-05:00) Indiana (East)</a></li>' +
                                '<li data-name="Central America Standard Time" data-offset="-06:00"><a href="#">(GMT-06:00) Central America</a></li>' +
                                '<li data-name="Central Standard Time" data-offset="-06:00"><a href="#">(GMT-06:00) Central Time (US &amp; Canada) *</a></li>' +
                                '<li data-name="Central Standard Time (Mexico)" data-offset="-06:00"><a href="#">(GMT-06:00) Guadalajara, Mexico City, Monterrey - New *</a></li>' +
                                '<li data-name="Central Standard Time (Mexico)" data-offset="-06:00"><a href="#">(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old</a></li>' +
                                '<li data-name="Canada Central Standard Time" data-offset="-06:00"><a href="#">(GMT-06:00) Saskatchewan</a></li>' +
                                '<li data-name="US Mountain Standard Time" data-offset="-07:00"><a href="#">(GMT-07:00) Arizona</a></li>' +
                                '<li data-name="Mountain Standard Time (Mexico)" data-offset="-07:00"><a href="#">(GMT-07:00) Chihuahua, La Paz, Mazatlan - New *</a></li>' +
                                '<li data-name="Mountain Standard Time (Mexico)" data-offset="-07:00"><a href="#">(GMT-07:00) Chihuahua, La Paz, Mazatlan - Old</a></li>' +
                                '<li data-name="Mountain Standard Time" data-offset="-07:00"><a href="#">(GMT-07:00) Mountain Time (US &amp; Canada) *</a></li>' +
                                '<li data-name="Pacific Standard Time" data-offset="-08:00"><a href="#">(GMT-08:00) Pacific Time (US &amp; Canada) *</a></li>' +
                                '<li data-name="Pacific Standard Time (Mexico)" data-offset="-08:00"><a href="#">(GMT-08:00) Tijuana, Baja California *</a></li>' +
                                '<li data-name="Alaskan Standard Time" data-offset="-09:00"><a href="#">(GMT-09:00) Alaska *</a></li>' +
                                '<li data-name="Hawaiian Standard Time" data-offset="-10:00"><a href="#">(GMT-10:00) Hawaii</a></li>' +
                                '<li data-name="Samoa Standard Time" data-offset="-11:00"><a href="#">(GMT-11:00) Midway Island, Samoa</a></li>' +
                                '<li data-name="Dateline Standard Time" data-offset="-12:00"><a href="#">(GMT-12:00) International Date Line West</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr class="scheduler-repeat">' +
                    '<td class="scheduler-label">Repeat</td>' +
                    '<td>' +
                        '<div class="repeat-interval">' +
                            '<div class="btn-group select">' +
                                '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">None (run once)</span><span class="caret"></span></button>' +
                                '<ul class="dropdown-menu">' +
                                    '<li data-value="none"><a href="#">None (run once)</a></li>' +
                                    '<li data-value="hourly" data-text="hour(s)"><a href="#">Hourly</a></li>' +
                                    '<li data-value="daily" data-text="day(s)"><a href="#">Daily</a></li>' +
                                    '<li data-value="weekdays"><a href="#">Weekdays</a></li>' +
                                    '<li data-value="weekly" data-text="week(s)"><a href="#">Weekly</a></li>' +
                                    '<li data-value="monthly" data-text="month(s)"><a href="#">Monthly</a></li>' +
                                    '<li data-value="yearly"><a href="#">Yearly</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="repeat-interval-panel">' +
                                '<div class="repeat-interval-pretext">every</div>' +
                                '<div class="spinner">' +
                                    '<input type="text" value="1" class="input-mini spinner-input">' +
                                    '<div class="spinner-buttons btn-group btn-group-vertical">' +
                                        '<button class="btn spinner-up"><i class="icon-chevron-up"></i></button>' +
                                        '<button class="btn spinner-down"><i class="icon-chevron-down"></i></button>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="repeat-interval-text">day(s)</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="recurrence-panel scheduler-weekly">' +
                            '<div class="btn-group" data-toggle="buttons-checkbox">' +
                                '<button type="button" class="btn" data-value="SU">Sun</button>' +
                                '<button type="button" class="btn" data-value="MO">Mon</button>' +
                                '<button type="button" class="btn" data-value="TU">Tue</button>' +
                                '<button type="button" class="btn" data-value="WE">Wed</button>' +
                                '<button type="button" class="btn" data-value="TH">Thu</button>' +
                                '<button type="button" class="btn" data-value="FR">Fri</button>' +
                                '<button type="button" class="btn" data-value="SA">Sat</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="recurrence-panel scheduler-monthly">' +
                            '<div class="scheduler-monthly-date">' +
                                '<label class="radio radio-custom"><input type="radio" name="scheduler-month" checked="checked" value="1"><i class="radio"></i>on day</label>' +
                                '<div class="btn-group select">' +
                                    '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">1</span><span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu">' +
                                        '<li data-value="1"><a href="#">1</a></li>' +
                                        '<li data-value="2"><a href="#">2</a></li>' +
                                        '<li data-value="3"><a href="#">3</a></li>' +
                                        '<li data-value="4"><a href="#">4</a></li>' +
                                        '<li data-value="5"><a href="#">5</a></li>' +
                                        '<li data-value="6"><a href="#">6</a></li>' +
                                        '<li data-value="7"><a href="#">7</a></li>' +
                                        '<li data-value="8"><a href="#">8</a></li>' +
                                        '<li data-value="9"><a href="#">9</a></li>' +
                                        '<li data-value="10"><a href="#">10</a></li>' +
                                        '<li data-value="11"><a href="#">11</a></li>' +
                                        '<li data-value="12"><a href="#">12</a></li>' +
                                        '<li data-value="13"><a href="#">13</a></li>' +
                                        '<li data-value="14"><a href="#">14</a></li>' +
                                        '<li data-value="15"><a href="#">15</a></li>' +
                                        '<li data-value="16"><a href="#">16</a></li>' +
                                        '<li data-value="17"><a href="#">17</a></li>' +
                                        '<li data-value="18"><a href="#">18</a></li>' +
                                        '<li data-value="19"><a href="#">19</a></li>' +
                                        '<li data-value="20"><a href="#">20</a></li>' +
                                        '<li data-value="21"><a href="#">21</a></li>' +
                                        '<li data-value="22"><a href="#">22</a></li>' +
                                        '<li data-value="23"><a href="#">23</a></li>' +
                                        '<li data-value="24"><a href="#">24</a></li>' +
                                        '<li data-value="25"><a href="#">25</a></li>' +
                                        '<li data-value="26"><a href="#">26</a></li>' +
                                        '<li data-value="27"><a href="#">27</a></li>' +
                                        '<li data-value="28"><a href="#">28</a></li>' +
                                        '<li data-value="29"><a href="#">29</a></li>' +
                                        '<li data-value="30"><a href="#">30</a></li>' +
                                        '<li data-value="31"><a href="#">31</a></li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                            '<div class="scheduler-monthly-day">' +
                                '<label class="radio radio-custom"><input type="radio" name="scheduler-month" value="2"><i class="radio"></i>on the</label>' +
                                '<div class="select btn-group month-day-pos">' +
                                    '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">First</span><span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu">' +
                                        '<li data-value="1"><a href="#">First</a></li>' +
                                        '<li data-value="2"><a href="#">Second</a></li>' +
                                        '<li data-value="3"><a href="#">Third</a></li>' +
                                        '<li data-value="4"><a href="#">Fourth</a></li>' +
                                        '<li data-value="-1"><a href="#">Last</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="select btn-group month-days">' +
                                    '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">Sunday</span><span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu">' +
                                        '<li data-value="SU"><a href="#">Sunday</a></li>' +
                                        '<li data-value="MO"><a href="#">Monday</a></li>' +
                                        '<li data-value="TU"><a href="#">Tuesday</a></li>' +
                                        '<li data-value="WE"><a href="#">Wednesday</a></li>' +
                                        '<li data-value="TH"><a href="#">Thursday</a></li>' +
                                        '<li data-value="FR"><a href="#">Friday</a></li>' +
                                        '<li data-value="SA"><a href="#">Saturday</a></li>' +
                                        '<li data-value="SU,MO,TU,WE,TH,FR,SA"><a href="#">Day</a></li>' +
                                        '<li data-value="MO,TU,WE,TH,FR"><a href="#">Weekday</a></li>' +
                                        '<li data-value="SU,SA"><a href="#">Weekend day</a></li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="recurrence-panel scheduler-yearly">' +
                            '<div class="scheduler-yearly-date">' +
                                '<label class="radio radio-custom"><input type="radio" name="scheduler-year" checked="checked" value="1"><i class="radio"></i>on</label>' +
                                '<div class="btn-group select year-month">' +
                                    '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">January</span><span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu">' +
                                        '<li data-value="1"><a href="#">January</a></li>' +
                                        '<li data-value="2"><a href="#">February</a></li>' +
                                        '<li data-value="3"><a href="#">March</a></li>' +
                                        '<li data-value="4"><a href="#">April</a></li>' +
                                        '<li data-value="5"><a href="#">May</a></li>' +
                                        '<li data-value="6"><a href="#">June</a></li>' +
                                        '<li data-value="7"><a href="#">July</a></li>' +
                                        '<li data-value="8"><a href="#">August</a></li>' +
                                        '<li data-value="9"><a href="#">September</a></li>' +
                                        '<li data-value="10"><a href="#">October</a></li>' +
                                        '<li data-value="11"><a href="#">November</a></li>' +
                                        '<li data-value="12"><a href="#">December</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="btn-group select year-month-day">' +
                                    '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">1</span><span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu" style="height:200px; overflow:auto;">' +
                                        '<li data-value="1"><a href="#">1</a></li>' +
                                        '<li data-value="2"><a href="#">2</a></li>' +
                                        '<li data-value="3"><a href="#">3</a></li>' +
                                        '<li data-value="4"><a href="#">4</a></li>' +
                                        '<li data-value="5"><a href="#">5</a></li>' +
                                        '<li data-value="6"><a href="#">6</a></li>' +
                                        '<li data-value="7"><a href="#">7</a></li>' +
                                        '<li data-value="8"><a href="#">8</a></li>' +
                                        '<li data-value="9"><a href="#">9</a></li>' +
                                        '<li data-value="10"><a href="#">10</a></li>' +
                                        '<li data-value="11"><a href="#">11</a></li>' +
                                        '<li data-value="12"><a href="#">12</a></li>' +
                                        '<li data-value="13"><a href="#">13</a></li>' +
                                        '<li data-value="14"><a href="#">14</a></li>' +
                                        '<li data-value="15"><a href="#">15</a></li>' +
                                        '<li data-value="16"><a href="#">16</a></li>' +
                                        '<li data-value="17"><a href="#">17</a></li>' +
                                        '<li data-value="18"><a href="#">18</a></li>' +
                                        '<li data-value="19"><a href="#">19</a></li>' +
                                        '<li data-value="20"><a href="#">20</a></li>' +
                                        '<li data-value="21"><a href="#">21</a></li>' +
                                        '<li data-value="22"><a href="#">22</a></li>' +
                                        '<li data-value="23"><a href="#">23</a></li>' +
                                        '<li data-value="24"><a href="#">24</a></li>' +
                                        '<li data-value="25"><a href="#">25</a></li>' +
                                        '<li data-value="26"><a href="#">26</a></li>' +
                                        '<li data-value="27"><a href="#">27</a></li>' +
                                        '<li data-value="28"><a href="#">28</a></li>' +
                                        '<li data-value="29"><a href="#">29</a></li>' +
                                        '<li data-value="30"><a href="#">30</a></li>' +
                                        '<li data-value="31"><a href="#">31</a></li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '<div class="scheduler-yearly-day">' +
                            '<label class="radio radio-custom"><input type="radio" name="scheduler-year" value="2"><i class="radio"></i>on the</label>' +
                            '<div class="btn-group select year-month-day-pos">' +
                                '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">First</span><span class="caret"></span></button>' +
                                '<ul class="dropdown-menu">' +
                                    '<li data-value="1"><a href="#">First</a></li>' +
                                    '<li data-value="2"><a href="#">Second</a></li>' +
                                    '<li data-value="3"><a href="#">Third</a></li>' +
                                    '<li data-value="4"><a href="#">Fourth</a></li>' +
                                    '<li data-value="5"><a href="#">Last</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="btn-group select year-month-days">' +
                                '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">Sunday</span><span class="caret"></span></button>' +
                                '<ul class="dropdown-menu">' +
                                    '<li data-value="SU"><a href="#">Sunday</a></li>' +
                                    '<li data-value="MO"><a href="#">Monday</a></li>' +
                                    '<li data-value="TU"><a href="#">Tuesday</a></li>' +
                                    '<li data-value="WE"><a href="#">Wednesday</a></li>' +
                                    '<li data-value="TH"><a href="#">Thursday</a></li>' +
                                    '<li data-value="FR"><a href="#">Friday</a></li>' +
                                    '<li data-value="SA"><a href="#">Saturday</a></li>' +
                                    '<li data-value="SU,MO,TU,WE,TH,FR,SA"><a href="#">Day</a></li>' +
                                    '<li data-value="MO,TU,WE,TH,FR"><a href="#">Weekday</a></li>' +
                                    '<li data-value="SU,SA"><a href="#">Weekend day</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="scheduler-yearly-day-text">of</div>' +
                                '<div class="btn-group select year-month">' +
                                    '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">January</span><span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu">' +
                                        '<li data-value="1"><a href="#">January</a></li>' +
                                        '<li data-value="2"><a href="#">February</a></li>' +
                                        '<li data-value="3"><a href="#">March</a></li>' +
                                        '<li data-value="4"><a href="#">April</a></li>' +
                                        '<li data-value="5"><a href="#">May</a></li>' +
                                        '<li data-value="6"><a href="#">June</a></li>' +
                                        '<li data-value="7"><a href="#">July</a></li>' +
                                        '<li data-value="8"><a href="#">August</a></li>' +
                                        '<li data-value="9"><a href="#">September</a></li>' +
                                        '<li data-value="10"><a href="#">October</a></li>' +
                                        '<li data-value="11"><a href="#">November</a></li>' +
                                        '<li data-value="12"><a href="#">December</a></li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr class="scheduler-end">' +
                    '<td class="scheduler-label">End</td>' +
                    '<td>' +
                        '<div class="btn-group select">' +
                            '<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label">Never</span><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu">' +
                                '<li data-value="never"><a href="#">Never</a></li>' +
                                '<li data-value="after"><a href="#">After</a></li>' +
                                '<li data-value="date"><a href="#">On date</a></li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="spinner">' +
                            '<input type="text" value="1" class="input-mini spinner-input">' +
                            '<div class="spinner-buttons btn-group btn-group-vertical">' +
                                '<button class="btn spinner-up"><i class="icon-chevron-up"></i></button>' +
                                '<button class="btn spinner-down"><i class="icon-chevron-down"></i></button>' +
                            '</div>' +
                            '<span>occurrence(s)</span>' +
                        '</div>' +
                        '<div class="datepicker dropdown">' +
                            '<div class="input-append">' +
                                '<div class="dropdown-menu"></div>' +
                                '<input type="text" class="span2" value="" data-toggle="dropdown">' +
                                '<button type="button" class="btn" data-toggle="dropdown"><i class="icon-calendar"></i></button>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>' +
        '</div>';
});