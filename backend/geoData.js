// Geo hierarchy: all 50 US states + DC → major cities → representative ZIP codes

const SECTORS = [
  'Technology & Software',
  'Healthcare & Life Sciences',
  'Financial Services & Fintech',
  'Retail & E-Commerce',
  'Real Estate & Construction',
  'Food & Beverage',
  'Education & EdTech',
  'Manufacturing & Logistics',
  'Media & Entertainment',
  'Energy & Sustainability',
  'Professional Services',
  'Transportation & Mobility',
  'Agriculture & AgTech',
  'Government & Public Sector',
  'Wellness & Fitness',
  'Hospitality & Tourism',
];

const geoData = {
  states: [
    { code: 'AL', name: 'Alabama', cities: [
      { name: 'Birmingham', zips: ['35201','35203','35205','35209','35222'] },
      { name: 'Montgomery', zips: ['36101','36104','36106','36107','36109'] },
      { name: 'Huntsville', zips: ['35801','35802','35803','35805','35806'] },
      { name: 'Mobile', zips: ['36601','36602','36604','36606','36608'] },
    ]},
    { code: 'AK', name: 'Alaska', cities: [
      { name: 'Anchorage', zips: ['99501','99502','99503','99504','99508'] },
      { name: 'Fairbanks', zips: ['99701','99705','99709','99712','99775'] },
      { name: 'Juneau', zips: ['99801','99802','99803','99811','99850'] },
    ]},
    { code: 'AZ', name: 'Arizona', cities: [
      { name: 'Phoenix', zips: ['85001','85003','85034','85040','85043'] },
      { name: 'Tucson', zips: ['85701','85705','85710','85711','85712'] },
      { name: 'Scottsdale', zips: ['85250','85251','85254','85257','85259'] },
      { name: 'Mesa', zips: ['85201','85202','85203','85204','85210'] },
      { name: 'Chandler', zips: ['85224','85225','85226','85244','85248'] },
      { name: 'Tempe', zips: ['85281','85282','85283','85284','85287'] },
      { name: 'Gilbert', zips: ['85233','85234','85295','85296','85297'] },
    ]},
    { code: 'AR', name: 'Arkansas', cities: [
      { name: 'Little Rock', zips: ['72201','72202','72204','72205','72209'] },
      { name: 'Fort Smith', zips: ['72901','72903','72904','72908','72916'] },
      { name: 'Fayetteville', zips: ['72701','72703','72704','72762','72764'] },
      { name: 'Bentonville', zips: ['72712','72713','72716','72718','72757'] },
    ]},
    { code: 'CA', name: 'California', cities: [
      { name: 'Los Angeles', zips: ['90001','90021','90028','90210','90291'] },
      { name: 'San Francisco', zips: ['94101','94103','94105','94107','94110'] },
      { name: 'San Jose', zips: ['95101','95110','95112','95113','95126'] },
      { name: 'San Diego', zips: ['92101','92103','92108','92123','92130'] },
      { name: 'Sacramento', zips: ['95814','95816','95818','95820','95822'] },
      { name: 'Fresno', zips: ['93701','93703','93706','93710','93721'] },
      { name: 'Long Beach', zips: ['90802','90803','90804','90806','90807'] },
      { name: 'Oakland', zips: ['94601','94602','94605','94607','94612'] },
      { name: 'Bakersfield', zips: ['93301','93304','93305','93306','93308'] },
      { name: 'Anaheim', zips: ['92801','92802','92804','92805','92806'] },
    ]},
    { code: 'CO', name: 'Colorado', cities: [
      { name: 'Denver', zips: ['80201','80203','80204','80205','80210'] },
      { name: 'Colorado Springs', zips: ['80901','80903','80905','80907','80910'] },
      { name: 'Aurora', zips: ['80010','80011','80012','80013','80014'] },
      { name: 'Fort Collins', zips: ['80521','80522','80524','80525','80526'] },
      { name: 'Boulder', zips: ['80301','80302','80303','80304','80305'] },
    ]},
    { code: 'CT', name: 'Connecticut', cities: [
      { name: 'Bridgeport', zips: ['06601','06604','06605','06606','06610'] },
      { name: 'New Haven', zips: ['06501','06510','06511','06512','06513'] },
      { name: 'Hartford', zips: ['06101','06103','06105','06106','06112'] },
      { name: 'Stamford', zips: ['06901','06902','06903','06905','06906'] },
    ]},
    { code: 'DE', name: 'Delaware', cities: [
      { name: 'Wilmington', zips: ['19801','19802','19803','19805','19806'] },
      { name: 'Dover', zips: ['19901','19902','19903','19904','19934'] },
      { name: 'Newark', zips: ['19702','19711','19713','19714','19716'] },
    ]},
    { code: 'DC', name: 'District of Columbia', cities: [
      { name: 'Washington', zips: ['20001','20002','20003','20004','20009'] },
    ]},
    { code: 'FL', name: 'Florida', cities: [
      { name: 'Miami', zips: ['33101','33125','33128','33130','33131'] },
      { name: 'Tampa', zips: ['33601','33602','33603','33605','33609'] },
      { name: 'Orlando', zips: ['32801','32803','32804','32806','32808'] },
      { name: 'Jacksonville', zips: ['32202','32204','32205','32207','32210'] },
      { name: 'Fort Lauderdale', zips: ['33301','33304','33305','33306','33308'] },
      { name: 'Tallahassee', zips: ['32301','32303','32304','32305','32308'] },
      { name: 'St. Petersburg', zips: ['33701','33702','33703','33704','33705'] },
      { name: 'Hialeah', zips: ['33010','33012','33013','33014','33016'] },
    ]},
    { code: 'GA', name: 'Georgia', cities: [
      { name: 'Atlanta', zips: ['30301','30303','30306','30308','30309'] },
      { name: 'Augusta', zips: ['30901','30904','30905','30906','30909'] },
      { name: 'Columbus', zips: ['31901','31903','31904','31905','31906'] },
      { name: 'Savannah', zips: ['31401','31404','31405','31406','31410'] },
      { name: 'Athens', zips: ['30601','30602','30605','30606','30607'] },
    ]},
    { code: 'HI', name: 'Hawaii', cities: [
      { name: 'Honolulu', zips: ['96801','96813','96814','96815','96816'] },
      { name: 'Hilo', zips: ['96720','96721','96740','96743','96760'] },
      { name: 'Kailua', zips: ['96734','96740','96744','96762','96763'] },
    ]},
    { code: 'ID', name: 'Idaho', cities: [
      { name: 'Boise', zips: ['83701','83702','83703','83704','83705'] },
      { name: 'Nampa', zips: ['83651','83652','83653','83686','83687'] },
      { name: 'Meridian', zips: ['83642','83646','83680'] },
      { name: 'Idaho Falls', zips: ['83401','83402','83404','83405','83406'] },
    ]},
    { code: 'IL', name: 'Illinois', cities: [
      { name: 'Chicago', zips: ['60601','60607','60610','60614','60632'] },
      { name: 'Aurora', zips: ['60502','60504','60505','60506','60507'] },
      { name: 'Rockford', zips: ['61101','61102','61103','61104','61107'] },
      { name: 'Joliet', zips: ['60431','60432','60433','60435','60436'] },
      { name: 'Springfield', zips: ['62701','62702','62703','62704','62712'] },
    ]},
    { code: 'IN', name: 'Indiana', cities: [
      { name: 'Indianapolis', zips: ['46201','46202','46204','46205','46218'] },
      { name: 'Fort Wayne', zips: ['46801','46802','46803','46804','46805'] },
      { name: 'Evansville', zips: ['47701','47708','47710','47711','47712'] },
      { name: 'South Bend', zips: ['46601','46614','46615','46616','46617'] },
    ]},
    { code: 'IA', name: 'Iowa', cities: [
      { name: 'Des Moines', zips: ['50301','50309','50310','50311','50312'] },
      { name: 'Cedar Rapids', zips: ['52401','52402','52403','52404','52405'] },
      { name: 'Davenport', zips: ['52801','52803','52804','52806','52807'] },
      { name: 'Sioux City', zips: ['51101','51102','51103','51104','51105'] },
    ]},
    { code: 'KS', name: 'Kansas', cities: [
      { name: 'Wichita', zips: ['67201','67202','67203','67204','67206'] },
      { name: 'Overland Park', zips: ['66061','66062','66063','66085','66212'] },
      { name: 'Kansas City', zips: ['66101','66102','66103','66104','66105'] },
      { name: 'Topeka', zips: ['66601','66603','66604','66605','66606'] },
    ]},
    { code: 'KY', name: 'Kentucky', cities: [
      { name: 'Louisville', zips: ['40201','40202','40203','40204','40205'] },
      { name: 'Lexington', zips: ['40501','40502','40503','40504','40505'] },
      { name: 'Bowling Green', zips: ['42101','42103','42104'] },
      { name: 'Covington', zips: ['41011','41014','41015','41016','41017'] },
    ]},
    { code: 'LA', name: 'Louisiana', cities: [
      { name: 'New Orleans', zips: ['70112','70113','70115','70116','70117'] },
      { name: 'Baton Rouge', zips: ['70801','70802','70803','70806','70808'] },
      { name: 'Shreveport', zips: ['71101','71103','71104','71105','71106'] },
      { name: 'Lafayette', zips: ['70501','70503','70506','70507','70508'] },
    ]},
    { code: 'ME', name: 'Maine', cities: [
      { name: 'Portland', zips: ['04101','04102','04103','04104','04106'] },
      { name: 'Lewiston', zips: ['04240','04241','04243'] },
      { name: 'Bangor', zips: ['04401','04402'] },
    ]},
    { code: 'MD', name: 'Maryland', cities: [
      { name: 'Baltimore', zips: ['21201','21202','21205','21210','21215'] },
      { name: 'Frederick', zips: ['21701','21702','21703','21704','21705'] },
      { name: 'Rockville', zips: ['20850','20851','20852','20853','20854'] },
      { name: 'Gaithersburg', zips: ['20877','20878','20879','20882','20886'] },
    ]},
    { code: 'MA', name: 'Massachusetts', cities: [
      { name: 'Boston', zips: ['02101','02108','02110','02115','02118'] },
      { name: 'Worcester', zips: ['01601','01602','01603','01604','01605'] },
      { name: 'Springfield', zips: ['01101','01103','01104','01105','01107'] },
      { name: 'Cambridge', zips: ['02138','02139','02140','02141','02142'] },
      { name: 'Lowell', zips: ['01850','01851','01852','01853','01854'] },
    ]},
    { code: 'MI', name: 'Michigan', cities: [
      { name: 'Detroit', zips: ['48201','48202','48205','48206','48207'] },
      { name: 'Grand Rapids', zips: ['49501','49503','49504','49505','49506'] },
      { name: 'Ann Arbor', zips: ['48103','48104','48105','48108','48109'] },
      { name: 'Lansing', zips: ['48901','48906','48910','48912','48917'] },
      { name: 'Flint', zips: ['48501','48502','48503','48504','48505'] },
    ]},
    { code: 'MN', name: 'Minnesota', cities: [
      { name: 'Minneapolis', zips: ['55401','55403','55404','55405','55408'] },
      { name: 'St. Paul', zips: ['55101','55102','55103','55104','55105'] },
      { name: 'Rochester', zips: ['55901','55902','55903','55904','55906'] },
      { name: 'Duluth', zips: ['55801','55802','55803','55804','55805'] },
    ]},
    { code: 'MS', name: 'Mississippi', cities: [
      { name: 'Jackson', zips: ['39201','39202','39203','39204','39206'] },
      { name: 'Gulfport', zips: ['39501','39503','39507'] },
      { name: 'Southaven', zips: ['38671','38672'] },
      { name: 'Hattiesburg', zips: ['39401','39402','39403','39404','39406'] },
    ]},
    { code: 'MO', name: 'Missouri', cities: [
      { name: 'Kansas City', zips: ['64101','64102','64105','64106','64108'] },
      { name: 'St. Louis', zips: ['63101','63103','63104','63105','63108'] },
      { name: 'Springfield', zips: ['65801','65802','65803','65804','65806'] },
      { name: 'Columbia', zips: ['65201','65202','65203'] },
    ]},
    { code: 'MT', name: 'Montana', cities: [
      { name: 'Billings', zips: ['59101','59102','59103','59105','59106'] },
      { name: 'Missoula', zips: ['59801','59802','59803','59804','59808'] },
      { name: 'Great Falls', zips: ['59401','59403','59404','59405'] },
      { name: 'Bozeman', zips: ['59715','59717','59718','59719','59771'] },
    ]},
    { code: 'NE', name: 'Nebraska', cities: [
      { name: 'Omaha', zips: ['68101','68102','68104','68105','68106'] },
      { name: 'Lincoln', zips: ['68501','68502','68503','68504','68505'] },
      { name: 'Bellevue', zips: ['68005','68123'] },
    ]},
    { code: 'NV', name: 'Nevada', cities: [
      { name: 'Las Vegas', zips: ['89101','89102','89103','89104','89109'] },
      { name: 'Henderson', zips: ['89002','89011','89014','89015','89002'] },
      { name: 'Reno', zips: ['89501','89502','89503','89505','89506'] },
      { name: 'North Las Vegas', zips: ['89030','89031','89032','89033','89084'] },
    ]},
    { code: 'NH', name: 'New Hampshire', cities: [
      { name: 'Manchester', zips: ['03101','03102','03103','03104','03109'] },
      { name: 'Nashua', zips: ['03060','03062','03063','03064'] },
      { name: 'Concord', zips: ['03301','03302','03303'] },
    ]},
    { code: 'NJ', name: 'New Jersey', cities: [
      { name: 'Newark', zips: ['07101','07102','07103','07104','07105'] },
      { name: 'Jersey City', zips: ['07302','07303','07304','07305','07306'] },
      { name: 'Paterson', zips: ['07501','07502','07503','07504','07505'] },
      { name: 'Elizabeth', zips: ['07201','07202','07206','07208'] },
      { name: 'Trenton', zips: ['08601','08608','08609','08610','08611'] },
    ]},
    { code: 'NM', name: 'New Mexico', cities: [
      { name: 'Albuquerque', zips: ['87101','87102','87104','87106','87108'] },
      { name: 'Las Cruces', zips: ['88001','88003','88004','88005','88006'] },
      { name: 'Santa Fe', zips: ['87501','87502','87505','87506','87507'] },
      { name: 'Rio Rancho', zips: ['87124'] },
    ]},
    { code: 'NY', name: 'New York', cities: [
      { name: 'New York City', zips: ['10001','10007','10013','11201','11211'] },
      { name: 'Buffalo', zips: ['14201','14202','14203','14204','14209'] },
      { name: 'Rochester', zips: ['14601','14602','14604','14605','14607'] },
      { name: 'Yonkers', zips: ['10701','10702','10703','10704','10705'] },
      { name: 'Syracuse', zips: ['13201','13202','13203','13204','13205'] },
      { name: 'Albany', zips: ['12201','12202','12203','12204','12206'] },
    ]},
    { code: 'NC', name: 'North Carolina', cities: [
      { name: 'Charlotte', zips: ['28201','28202','28203','28204','28205'] },
      { name: 'Raleigh', zips: ['27601','27603','27605','27607','27609'] },
      { name: 'Greensboro', zips: ['27401','27403','27405','27406','27408'] },
      { name: 'Durham', zips: ['27701','27703','27704','27705','27707'] },
      { name: 'Winston-Salem', zips: ['27101','27103','27104','27105','27106'] },
      { name: 'Fayetteville', zips: ['28301','28303','28304','28305','28306'] },
      { name: 'Cary', zips: ['27511','27512','27513','27518','27519'] },
    ]},
    { code: 'ND', name: 'North Dakota', cities: [
      { name: 'Fargo', zips: ['58101','58102','58103','58104','58108'] },
      { name: 'Bismarck', zips: ['58501','58503','58504','58505','58506'] },
      { name: 'Grand Forks', zips: ['58201','58202','58203','58206'] },
    ]},
    { code: 'OH', name: 'Ohio', cities: [
      { name: 'Columbus', zips: ['43201','43202','43203','43210','43215'] },
      { name: 'Cleveland', zips: ['44101','44102','44103','44104','44105'] },
      { name: 'Cincinnati', zips: ['45201','45202','45203','45204','45205'] },
      { name: 'Toledo', zips: ['43601','43602','43604','43605','43606'] },
      { name: 'Akron', zips: ['44301','44302','44303','44304','44305'] },
      { name: 'Dayton', zips: ['45401','45402','45403','45404','45405'] },
    ]},
    { code: 'OK', name: 'Oklahoma', cities: [
      { name: 'Oklahoma City', zips: ['73101','73102','73103','73104','73105'] },
      { name: 'Tulsa', zips: ['74101','74103','74104','74105','74106'] },
      { name: 'Norman', zips: ['73019','73069','73071','73072'] },
      { name: 'Broken Arrow', zips: ['74011','74012','74013','74014'] },
    ]},
    { code: 'OR', name: 'Oregon', cities: [
      { name: 'Portland', zips: ['97201','97202','97203','97204','97205'] },
      { name: 'Salem', zips: ['97301','97302','97303','97304','97305'] },
      { name: 'Eugene', zips: ['97401','97402','97403','97404','97405'] },
      { name: 'Bend', zips: ['97701','97702','97703','97708','97709'] },
    ]},
    { code: 'PA', name: 'Pennsylvania', cities: [
      { name: 'Philadelphia', zips: ['19101','19102','19103','19104','19107'] },
      { name: 'Pittsburgh', zips: ['15201','15203','15204','15205','15206'] },
      { name: 'Allentown', zips: ['18101','18102','18103','18104','18105'] },
      { name: 'Erie', zips: ['16501','16502','16503','16504','16505'] },
      { name: 'Reading', zips: ['19601','19602','19604','19605','19606'] },
    ]},
    { code: 'RI', name: 'Rhode Island', cities: [
      { name: 'Providence', zips: ['02901','02903','02904','02905','02906'] },
      { name: 'Cranston', zips: ['02910','02920'] },
      { name: 'Warwick', zips: ['02886','02887','02888','02889'] },
    ]},
    { code: 'SC', name: 'South Carolina', cities: [
      { name: 'Columbia', zips: ['29201','29202','29203','29204','29205'] },
      { name: 'Charleston', zips: ['29401','29403','29405','29407','29412'] },
      { name: 'Greenville', zips: ['29601','29602','29605','29607','29609'] },
      { name: 'Myrtle Beach', zips: ['29572','29575','29577','29578','29579'] },
    ]},
    { code: 'SD', name: 'South Dakota', cities: [
      { name: 'Sioux Falls', zips: ['57101','57103','57104','57105','57106'] },
      { name: 'Rapid City', zips: ['57701','57702','57703'] },
      { name: 'Aberdeen', zips: ['57401','57402'] },
    ]},
    { code: 'TN', name: 'Tennessee', cities: [
      { name: 'Nashville', zips: ['37201','37203','37204','37206','37219'] },
      { name: 'Memphis', zips: ['38101','38103','38104','38105','38111'] },
      { name: 'Knoxville', zips: ['37901','37902','37909','37916','37917'] },
      { name: 'Chattanooga', zips: ['37401','37402','37403','37404','37405'] },
      { name: 'Clarksville', zips: ['37040','37041','37042','37043','37044'] },
    ]},
    { code: 'TX', name: 'Texas', cities: [
      { name: 'Houston', zips: ['77001','77002','77036','77042','77056'] },
      { name: 'San Antonio', zips: ['78201','78202','78205','78209','78212'] },
      { name: 'Dallas', zips: ['75201','75202','75204','75205','75214'] },
      { name: 'Austin', zips: ['78701','78702','78703','78704','78705'] },
      { name: 'Fort Worth', zips: ['76101','76102','76103','76104','76107'] },
      { name: 'El Paso', zips: ['79901','79902','79903','79904','79905'] },
      { name: 'Arlington', zips: ['76001','76002','76006','76010','76011'] },
      { name: 'Corpus Christi', zips: ['78401','78402','78404','78405','78411'] },
      { name: 'Plano', zips: ['75023','75024','75025','75074','75075'] },
      { name: 'Lubbock', zips: ['79401','79403','79404','79407','79410'] },
    ]},
    { code: 'UT', name: 'Utah', cities: [
      { name: 'Salt Lake City', zips: ['84101','84102','84103','84104','84105'] },
      { name: 'West Valley City', zips: ['84119','84120','84128'] },
      { name: 'Provo', zips: ['84601','84602','84604','84606'] },
      { name: 'West Jordan', zips: ['84084','84088'] },
      { name: 'Ogden', zips: ['84401','84403','84404','84405'] },
    ]},
    { code: 'VT', name: 'Vermont', cities: [
      { name: 'Burlington', zips: ['05401','05402','05403','05404','05405'] },
      { name: 'South Burlington', zips: ['05403'] },
      { name: 'Montpelier', zips: ['05601','05602','05641'] },
    ]},
    { code: 'VA', name: 'Virginia', cities: [
      { name: 'Virginia Beach', zips: ['23450','23451','23452','23453','23454'] },
      { name: 'Norfolk', zips: ['23501','23502','23503','23504','23505'] },
      { name: 'Chesapeake', zips: ['23320','23321','23322','23323','23324'] },
      { name: 'Richmond', zips: ['23218','23219','23220','23221','23222'] },
      { name: 'Arlington', zips: ['22201','22202','22203','22204','22205'] },
      { name: 'Alexandria', zips: ['22301','22302','22303','22304','22305'] },
    ]},
    { code: 'WA', name: 'Washington', cities: [
      { name: 'Seattle', zips: ['98101','98102','98103','98104','98121'] },
      { name: 'Spokane', zips: ['99201','99202','99203','99204','99205'] },
      { name: 'Tacoma', zips: ['98401','98402','98403','98404','98405'] },
      { name: 'Vancouver', zips: ['98660','98661','98662','98663','98664'] },
      { name: 'Bellevue', zips: ['98004','98005','98006','98007','98008'] },
    ]},
    { code: 'WV', name: 'West Virginia', cities: [
      { name: 'Charleston', zips: ['25301','25302','25303','25304','25305'] },
      { name: 'Huntington', zips: ['25701','25702','25703','25704','25705'] },
      { name: 'Morgantown', zips: ['26501','26505','26506'] },
    ]},
    { code: 'WI', name: 'Wisconsin', cities: [
      { name: 'Milwaukee', zips: ['53201','53202','53203','53204','53205'] },
      { name: 'Madison', zips: ['53701','53703','53704','53705','53706'] },
      { name: 'Green Bay', zips: ['54301','54302','54303','54304','54311'] },
      { name: 'Kenosha', zips: ['53140','53141','53142','53143','53144'] },
    ]},
    { code: 'WY', name: 'Wyoming', cities: [
      { name: 'Cheyenne', zips: ['82001','82002','82003','82007','82009'] },
      { name: 'Casper', zips: ['82601','82602','82604','82605'] },
      { name: 'Laramie', zips: ['82070','82071','82072'] },
    ]},
  ],
};

// ── Opportunity overrides for specific high-signal ZIPs ─────────────────────
const opportunityOverrides = {
  '78701': {
    'Technology & Software': {
      score: 9.3, name: 'AI Legal Ops Platform for SMBs', model: 'SaaS',
      tam: '$37.9B', sam: '$8.2B', som: '$5.1M (Yr 3)', grossMargin: '82%',
      ltv_cac: '27:1', paybackMonths: 2.2, topCompetitors: ['Ironclad','ContractPodAi','Harvey AI'],
      bestZip: '78701', startupCost: '$362K', exitVal: '$140M–$200M',
      verdict: 'Every SMB that signs a contract is a potential customer; LLM costs fall annually while value rises.',
    },
    'Energy & Sustainability': {
      score: 8.9, name: 'ESG Reporting Automation SaaS', model: 'SaaS',
      tam: '$4.1B → $22B by 2030', sam: '$3.8B', som: '$9.2M (Yr 3)', grossMargin: '79%',
      ltv_cac: '15:1', paybackMonths: 4.6, topCompetitors: ['Watershed','Persefoni','Workiva'],
      bestZip: '78701', startupCost: '$362K', exitVal: '$250M–$380M',
      verdict: 'SEC and EU mandates make ESG reporting legally required — the CFO has no choice but to purchase.',
    },
    'Professional Services': {
      score: 8.2, name: 'AI-Augmented Accounting for E-Commerce & SaaS', model: 'Monthly retainer + project fees',
      tam: '$510B', sam: '$6.1B', som: '$4.2M (Yr 3)', grossMargin: '67%',
      ltv_cac: '22:1', paybackMonths: 2.8, topCompetitors: ['Pilot.com','Bench','Kruze Consulting'],
      bestZip: '78701', startupCost: '$48K', exitVal: '$120M–$200M',
      verdict: 'AI reduces entry-level accounting labor cost 65%, creating structural margin advantages over traditional CPA firms.',
    },
  },
  '37203': {
    'Technology & Software': {
      score: 9.1, name: 'AI-Powered Revenue Cycle Management for Independent Practices', model: 'SaaS + % of collections',
      tam: '$238B', sam: '$31B', som: '$8.4M (Yr 3)', grossMargin: '79%',
      ltv_cac: '30:1', paybackMonths: 2.7, topCompetitors: ['Kareo/Tebra','AdvancedMD','Athenahealth'],
      bestZip: '37203', startupCost: '$1.4M seed', exitVal: '$175M–$260M',
      verdict: 'Compulsory demand + AI margin advantages + fragmented $31B TAM = durable path to $20M ARR.',
    },
    'Hospitality & Tourism': {
      score: 8.6, name: 'AI Dynamic Pricing SaaS for Independent Hotels', model: 'SaaS ($299–$999/mo per property)',
      tam: '$4.2B', sam: '$1.1B', som: '$18.1M (Yr 3)', grossMargin: '83%',
      ltv_cac: '28:1', paybackMonths: 1.9, topCompetitors: ['IDeaS','Duetto','OTA Insight'],
      bestZip: '37203', startupCost: '$280K', exitVal: '$450M–$700M',
      verdict: '50,000 independent hotels navigate pricing with spreadsheets, losing $8,200/property/year in revenue.',
    },
  },
  '85034': {
    'Real Estate & Construction': {
      score: 8.7, name: 'Modular Workforce Housing Development', model: 'Real estate development + property management',
      tam: '$48B', sam: '$12B', som: '$3.8M NOI (Yr 5)', grossMargin: '52% NOI margin',
      ltv_cac: 'N/A', paybackMonths: 24, topCompetitors: ['NexMetro','AMH','D.R. Horton'],
      bestZip: '85034', startupCost: '$3.8M equity', exitVal: '$28M–$36M',
      verdict: "Phoenix's 38,000-unit housing shortage + modular cost advantage + employer partnerships = triple tailwind.",
    },
    'Energy & Sustainability': {
      score: 8.4, name: 'EV Fleet Charging Infrastructure + Management SaaS', model: 'Hardware install + SaaS',
      tam: '$168B by 2030', sam: '$22B', som: '$14M (Yr 3)', grossMargin: '46%',
      ltv_cac: '18:1', paybackMonths: 3.5, topCompetitors: ['ChargePoint','Blink','Voltera'],
      bestZip: '85034', startupCost: '$2.2M', exitVal: '$400M–$700M',
      verdict: "AZ's fleet electrification mandates and Sky Harbor corridor employer base create a captive install pipeline.",
    },
  },
  '94105': {
    'Food & Beverage': {
      score: 8.4, name: 'Cognitive Performance Functional Beverage Brand', model: 'D2C + B2B corporate + retail',
      tam: '$53B', sam: '$4.2B', som: '$8.5M (Yr 3)', grossMargin: '58%',
      ltv_cac: '24:1', paybackMonths: 2.1, topCompetitors: ['RXBAR','Kin Euphorics','Thesis Nootropics'],
      bestZip: '94105', startupCost: '$380K', exitVal: '$150M–$300M',
      verdict: 'The cognitive beverage category has no incumbent brand and SoMa knowledge workers are the perfect launch cohort.',
    },
  },
  '80203': {
    'Healthcare & Life Sciences': {
      score: 8.6, name: 'Concierge Mental Health Practice (Hybrid)', model: 'Direct-pay membership $299/mo',
      tam: '$280B', sam: '$22B', som: '$4.8M (Yr 3)', grossMargin: '58%',
      ltv_cac: '38:1', paybackMonths: 1.3, topCompetitors: ['Talkspace','Headway','Traditional private practice'],
      bestZip: '80203', startupCost: '$380K', exitVal: '$60M–$95M',
      verdict: '6-week therapist waitlists + willing-to-pay professional population = durable pricing arbitrage.',
    },
  },
  '90028': {
    'Media & Entertainment': {
      score: 8.7, name: 'Creator Economy Financial Services Platform', model: 'Banking interchange + factoring + subscription',
      tam: '$480B globally', sam: '$8.4B', som: '$12M (Yr 3)', grossMargin: '73%',
      ltv_cac: '31:1', paybackMonths: 1.8, topCompetitors: ['Mercury','Lili','Found'],
      bestZip: '90028', startupCost: '$1.8M', exitVal: '$800M–$1.5B',
      verdict: '3.8M professional creators have complex irregular income that no bank was designed for.',
    },
  },
  '27601': {
    'Education & EdTech': {
      score: 7.7, name: 'Outcome-Based Coding Bootcamp (ISA Model)', model: 'Income Share Agreement + employer placement fees',
      tam: '$101B', sam: '$4.8B', som: '$5.7M (Yr 3)', grossMargin: '58%',
      ltv_cac: '19:1', paybackMonths: 3.2, topCompetitors: ['Flatiron School','General Assembly','Turing School'],
      bestZip: '27601', startupCost: '$420K', exitVal: '$85M–$135M',
      verdict: 'Research Triangle tech labor shortage creates employer urgency; ISA model aligns school incentives with student outcomes.',
    },
  },
};

function generateDefaultOpportunity(zip, sector) {
  const sectorDefaults = {
    'Technology & Software':        { score: 7.8, model: 'SaaS', grossMargin: '75%', ltv_cac: '22:1', paybackMonths: 3.5, tam: '$12–38B', exitVal: '$50M–$200M' },
    'Healthcare & Life Sciences':   { score: 7.9, model: 'Service + SaaS', grossMargin: '52%', ltv_cac: '18:1', paybackMonths: 4.2, tam: '$28–280B', exitVal: '$40M–$150M' },
    'Financial Services & Fintech': { score: 7.7, model: 'SaaS + transaction fees', grossMargin: '65%', ltv_cac: '20:1', paybackMonths: 3.8, tam: '$8–210B', exitVal: '$60M–$300M' },
    'Retail & E-Commerce':          { score: 7.2, model: 'D2C + marketplace', grossMargin: '38%', ltv_cac: '12:1', paybackMonths: 5.0, tam: '$14–124B', exitVal: '$30M–$120M' },
    'Real Estate & Construction':   { score: 7.5, model: 'Development + SaaS', grossMargin: '45%', ltv_cac: '15:1', paybackMonths: 18, tam: '$12–48B', exitVal: '$40M–$180M' },
    'Food & Beverage':              { score: 7.1, model: 'D2C + B2B distribution', grossMargin: '48%', ltv_cac: '14:1', paybackMonths: 4.5, tam: '$4–53B', exitVal: '$30M–$200M' },
    'Education & EdTech':           { score: 7.6, model: 'SaaS + services', grossMargin: '62%', ltv_cac: '18:1', paybackMonths: 4.0, tam: '$5–101B', exitVal: '$40M–$150M' },
    'Manufacturing & Logistics':    { score: 7.8, model: 'SaaS + marketplace', grossMargin: '68%', ltv_cac: '24:1', paybackMonths: 3.2, tam: '$2–680B', exitVal: '$80M–$400M' },
    'Media & Entertainment':        { score: 7.2, model: 'Subscription + ads', grossMargin: '55%', ltv_cac: '16:1', paybackMonths: 4.8, tam: '$3–480B', exitVal: '$30M–$350M' },
    'Energy & Sustainability':      { score: 8.1, model: 'SaaS + HaaS', grossMargin: '62%', ltv_cac: '20:1', paybackMonths: 4.0, tam: '$4–168B', exitVal: '$80M–$500M' },
    'Professional Services':        { score: 8.0, model: 'Retainer + project', grossMargin: '60%', ltv_cac: '22:1', paybackMonths: 2.5, tam: '$2–44B', exitVal: '$40M–$200M' },
    'Transportation & Mobility':    { score: 7.6, model: 'SaaS + managed service', grossMargin: '45%', ltv_cac: '18:1', paybackMonths: 5.5, tam: '$2–168B', exitVal: '$100M–$600M' },
    'Agriculture & AgTech':         { score: 7.4, model: 'HaaS + SaaS', grossMargin: '52%', ltv_cac: '16:1', paybackMonths: 5.0, tam: '$1–32B', exitVal: '$40M–$200M' },
    'Government & Public Sector':   { score: 7.5, model: 'SaaS + long-term contracts', grossMargin: '58%', ltv_cac: '20:1', paybackMonths: 6.0, tam: '$2–53B', exitVal: '$100M–$500M' },
    'Wellness & Fitness':           { score: 7.8, model: 'Membership + SaaS', grossMargin: '62%', ltv_cac: '24:1', paybackMonths: 3.0, tam: '$3–94B', exitVal: '$50M–$350M' },
    'Hospitality & Tourism':        { score: 7.4, model: 'SaaS + ops', grossMargin: '58%', ltv_cac: '20:1', paybackMonths: 3.5, tam: '$1–42B', exitVal: '$60M–$700M' },
  };
  const d = sectorDefaults[sector] || sectorDefaults['Technology & Software'];
  return {
    score: d.score,
    name: `${sector} Opportunity — ZIP ${zip}`,
    model: d.model,
    tam: d.tam,
    sam: 'See full report',
    som: 'See full report',
    grossMargin: d.grossMargin,
    ltv_cac: d.ltv_cac,
    paybackMonths: d.paybackMonths,
    topCompetitors: ['Fragmented incumbents', 'Legacy platforms', 'Manual processes'],
    bestZip: zip,
    startupCost: 'Varies by scope',
    exitVal: d.exitVal,
    verdict: `The ${sector} sector in ZIP ${zip} presents a viable opportunity supported by national trends; conduct local demand validation before committing capital.`,
  };
}

function getSectorsForZip(zip) {
  return SECTORS.map(name => ({
    name,
    score: opportunityOverrides[zip]?.[name]?.score ?? null,
  }));
}

function getOpportunity(zip, sector) {
  if (opportunityOverrides[zip]?.[sector]) return opportunityOverrides[zip][sector];
  return generateDefaultOpportunity(zip, sector);
}

module.exports = { geoData, getSectorsForZip, getOpportunity, SECTORS };
