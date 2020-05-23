
  let monstersName =  new Array('문어 괴물','스켈레톤');
  let monsterOrder = 0;
  const maxMonsterOrder = 5;//본래 이미지보다 1개 적게
  let myImage = new Image();
  let myDefenseImage = new Image();
  let myExplosionImage = new Array();
  let skillArray = new Array();
  let backpackArray = new Array();
  let chat = new Array();
  let monstersTurn= Math.random()*4+3;
  let playerDefenseless = 1;//1인 경우에 무방비, 0인 경우에 방어 상태
  let imageOrder= 0;//현재 사진이 별로 없으므로 사진 순서
  let chatOrder= 0;//배열 순서
  let animationTimeNum = 0;// 애니메이션 실행 숫자
  let runningThis = new Array();
  runningThis[0] = false;
  let skillEnergy= 0;
  skillArray[0] = "1. 돌 던지기 공격력: 1.2배 비용: 2";
  backpackArray[0] = "아직 물품이 없습니다.";
  myImage.src = "maps/숲1.jpg";
  myDefenseImage.src = "players/방패.png";
  monsterImages = new Array();
  for(i=1; i<= maxMonsterOrder; i++){
    monsterImages[i] = new Image();
    monsterImages[i].src = "monsters/monster"+i+".png";
  }
  let stoneX= 70;
  let stoneY= 120;

  let player = {
    name: 'newPlayer',
    level: 1,
    maxHp: 150,
    hp: 150,
    maxXp: 15,
    xp: 0,
    att: 30
  };
  let monster = {
    name: monstersName[monsterOrder],
    level: 0,
    maxHp: 100,
    hp: 50,
    xp: 15,
    att: 10
  };
  function showAllLayer(){//몬스터와 플레이어 모든 레이어를 보여줌
    comfirmPlayerName();
    showPlayerLayer();
    showMonsterLayer();
    drawImage();
    showSkillEnergy();
    runningThisToTure();
  }
  function runningThisToTrue()
  {
    for(i=1; i<runningThisToFalse.length;i++)//레벨 제한 걸기
      runningThisToFalse[i]=true;
  }
  function comfirmPlayerName(){//처음 시작할 때 용사의 이름이 무엇인지 체크
    while(1){
      player.name = prompt("용사의 이름은 무엇입니까?","");
      if(player.name==''|| player.name== undefined || player.name==' '){
        confirm("공백은 불가능합니다.");
      }
      else{
        break;
      }
    }
  }

  function showPlayerLayer(){//플레이어의 모든 레이어를 보여줌
    showPlayerLevel();
    showPlayerHp();
    showPlayerXp();
  }

  function showMonsterLayer(){//몬스터의 모든 레이어를 보여줌
    showMonsterHp();
    showMonsterName();
  }

  function showPlayerLevel() {//플레이어 레벨
    document.getElementById('playerLevel').innerHTML = '<strong>'+player.name+'</strong>'+'<br>'+player.level +' level'+'<br>'+'공격력: '+player.att;
  }

  function showMonsterName() {//몬스터 이름
    document.getElementById('monsterLevel').innerHTML = '<strong>'+monster.name+'</strong>'+'<br>'+monster.level+' level'+'<br>'+'공격력: '+monster.att;
  }

  function showPlayerHp() {//플레이어 hp
    document.getElementById('playerHp').innerHTML  = player.hp+'/'+player.maxHp;
  }

  function showMonsterHp() {//몬스터 hp
    document.getElementById('monsterHp').innerHTML  = monster.hp+'/'+monster.maxHp;
  }

  function showPlayerXp(){//플레이어 xp
    document.getElementById('playerXp').innerHTML = player.xp+'/'+player.maxXp;
  }
  function showSkillEnergy(){//스킬 에너지
    document.getElementById('skillEnergyArea').innerHTML = ''+skillEnergy;
  }

  function drawImage(){ //배경 이미지 그리기
    const ctx = document.getElementById('battleArea').getContext('2d');
    ctx.drawImage(myImage,0,0,300,150);
  }

  function attackMonster(){//용사가 공격
    monster.hp-=player.att;
    monster.hp= Math.floor(monster.hp);
    playerDefenseless=1;
    attackAnimation();//공격 모션
    attackMusic();
    if(monster.hp>0){//몬스터가 죽지 않았다면
      showMonsterHp();
      monstersAttack();
    }
    else {
      monsterOrder+=1;
      appearNewMonster();
    }
   }

   function attackAnimation(){ //공격 모션
     const ctx = document.getElementById('battleArea2').getContext('2d');
     if(animationTimeNum==3){
       clearAnimation(2);
       animationTimeNum=0;
     }
     ctx.fillRect(250,10,1,90);
     ctx.translate(250.5,55);//x , y  = x or y + 0.5*width or height
     ctx.rotate((Math.PI/ 180)*(Math.random()*50)+1);
     ctx.translate(-250.5,-55);
     animationTimeNum++;
   }
   function clearAnimation(num){
     const ctx = document.getElementById('battleArea'+num).getContext('2d');
     ctx.clearRect(0,0,600,300);
   }
   function attackMusic(){  //공격 소리
     const audio = document.getElementById('playAudio');
     audio.volume = 0.3;
     if(audio.paused){
       audio.play();
     }else{
       audio.pause();
       audio.play();
       audio.currentTime = 0;
     }
   }
 function appearNewMonster(){//새로운 몬스터를 나타나게 함
    giveXpToPlayer();
    changeMonsterImage();
    clearAnimation(2);
    if(monsterOrder%5==0){
      chatDialog('몬스터가 죽었습니다.'+' xp +'+monster.xp+'</br>');
      appearBossMonster(2);
    }
    else if(monsterOrder%5==1&&monsterOrder!=1){
      chatDialog('보스몬스터가 죽었습니다.'+'xp +'+monster.xp+'<br>');
      appearBossMonster(0.5);
    }
    else{
      chatDialog('몬스터가 죽었습니다.'+' xp +'+monster.xp+'</br>');
      changeMonsterStat();
    }
  }
  function appearBossMonster(buff){//보스 몬스터를 소환하는 함수 or 디버프 먹이는 함수
    if(buff==0.5){
      reNameMonster();
    }else{
      monster.name='보스';
    }
    monster.level =monsterOrder;
    monster.maxHp *= buff;
    monster.hp = monster.maxHp;
    monster.att *= buff;
    monster.xp *= buff;
    showMonsterLayer();
  }
  function changeMonsterImage(){//몬스터 이미지를 변경하는 함수
    if(imageOrder==maxMonsterOrder){
      imageOrder=0;
    }
    document.images["monster"].src = monsterImages[imageOrder+1].src;
    imageOrder+=1;
  }
  function giveXpToPlayer(){// 플레이어에게 경험치 부여
    player.xp += monster.xp;
    checkPlayerXp();
  }
  function checkPlayerXp(){//레벨업 할지 안 할지 판단하는 함수
    if(player.xp>=player.maxXp)
    {
      levelUpPlayer();
    }
    else{
      showPlayerXp();
    }
  }
  function levelUpPlayer(){//플레이어 레벨업
    player.level+=1;
    if(player.level==5){
      runningThis[1] = false;
      chatDialog("새로운 스킬을 배웠다!: 폭발");
      skillArray[1] = '<br>'+"2. 폭발 공격력: 2.5배 비용: 4"
    }
    player.maxHp += monsterOrder*3;
    player.hp = player.maxHp;
    player.att += monsterOrder
    giveLeftXp();
    player.maxXp += 15;
    showPlayerLayer();
  }
  function giveLeftXp(){//남은 경험치까지 쭉쭉 준다
    player.xp-=player.maxXp;
    checkPlayerXp();
  }
  function changeMonsterStat(){//몬스터 스텟을 변경함
    reNameMonster();
    monster.level += 1;
    monster.maxHp+= monsterOrder*3;
    monster.hp = monster.maxHp;
    monster.att += monsterOrder
    monster.xp += monsterOrder*2;
    showMonsterLayer();
  }
  function reNameMonster(){//몬스터 닉네임이 undefined로 찾을 수 없다면 미정으로 변환
    if(monstersName[monsterOrder]==undefined){
      monstersName[monsterOrder]='미정';
    }
    monster.name= monstersName[monsterOrder];
  }
  function defenseAttack(){//방어 상태 만들기
    playerDefenseless= 0;
    defenseAnimation();
    monstersAttack();
  }
  function monstersAttack(){//몬스터턴이 10이상이 되면 공격을 받음.
    monstersTurn+= Math.floor(Math.random()*7)+3;
    if(monstersTurn>=10){
        playerBeAttacked();
        showPlayerHp();
      }
  }
  function playerBeAttacked(){//공격 받는데 무방비 상태면 그대로 방어 상태면 1/2
    playerDefense();
    if(player.hp<=0){
      playerDie();
    }
    monstersTurn=0;
  }
  function playerDefense(){//플레이어가 방어를 했느냐 안 했느냐
    if(playerDefenseless==1){
      player.hp-=monster.att;
      chatDialog(monster.att+"의 데미지를 입었다.");
    }else{
      defenseMusic();
      chatDialog("방어 성공!"+monster.att/2+"의 데미지만을 입었다.");
      player.hp-=monster.att/2;
      player.hp= Math.floor(player.hp);
      playerDefenseless=1;
      skillEnergy+=1;
      showSkillEnergy();
    }
  }
  function defenseMusic(){//방어 노래
    const audio = document.getElementById('defenseAudio');
    audio.volume = 0.1;
    if(audio.paused){
      audio.play();
    }else{
      audio.pause();
      audio.play();
      audio.currentTime = 0;
    }
  }
  function defenseAnimation(){//방어 모션
    var ctx = document.getElementById('battleArea3').getContext('2d');
    ctx.drawImage(myDefenseImage,120,40,70,70);
    setTimeout(function(){
      ctx.clearRect(0,0,600,300);
    },2000)
  }
  function loadingSkillArray(skills){//스킬 창 불러오기
    skills.innerHTML = skillArray+'<br>';
  }
  function openSkillArea(){//스킬 창 띄우기
    const skills = document.getElementById("skillBook");
    skillBook.style.display= "block";
    loadingSkillArray(skillBook);
  }
  function closeArea(){//닫기 버튼
    const skillBooks = document.getElementById("skillBook");
    const backpacks = document.getElementById("backpackArea");
    if(skillBooks.style.display=="block")
      skillBooks.style.display="none";
    else(backpacks.style.display=="block")
      backpacks.style.display="none";
  }
  function openBackpackArea(){//가방 열기
    const backpacks = document.getElementById("backpackArea");
    backpacks.style.display= "block";
    loadingbackPackArray(backpacks);
  }
  function loadingbackPackArray(backpacks){//가방 불러오기
    backpacks.innerHTML = backpackArray+'<br>';
  }
  function chatDialog(addChat){//채팅 적는것 하는 방법 chatDialog(섹시한 포돌이) =섹시한 포돌이
    const chating = document.getElementById('dialogArea');
    if(chatOrder==5){
      chatOrder=4;
      chat.shift()
    }
    chat[chatOrder] = addChat;
    chatOrder++;
    for (let i = 0 ; i < chat.length ; i++)
    {
      const li = document.getElementById('msg_' + i);
      li.innerHTML = chat[i];
    }
  }
  function playerDie(){//플레이어가 죽으면 실행하는 함수 이미지와 재시작 버튼을 띄움
    const image = document.getElementById("youDie");
    image.style.display= 'block';
    const button = document.getElementById("newLoadButton");
    button.style.display= 'block';
  }
  function newLoad(){// 말 그대로 새로 로딩하는거
    window.location.reload();
  }
  function usePlayerSkill(){
    playerDefenseless=1;
    useSkill = event.keyCode;
    switch(useSkill-48){
      case 1:
        throwStone();
        break;
      case 2:
        explosion();
        break;
      default:
        console.log(useSkill);
    }
  }
  function throwStone(){
    if(runningThis==true||skillEnergy<=1){
      return;
    }
    skillEnergy -= 2;
    showSkillEnergy();
    drawStone = setInterval(function(){
      const ctx = document.getElementById('battleArea4').getContext('2d');
      if(stoneY==50){
        clearAnimation(4);
        stoneX = 70;
        stoneY = 120;
        clearInterval(drawStone);
        damageToMonster(player.att*1.2);
        runningThis=false;
        return;
      }
      runningThis=true;
      clearAnimation(4);
      ctx.beginPath();
      ctx.arc(stoneX, stoneY, 10, 0, Math.PI*2);//70,120
      ctx.fillStyle = "#808080";
      ctx.lineWidth=3;
      ctx.fill();
      ctx.closePath();
      stoneX += 2.5;
      stoneY -= 1;
    },5);
  }

  function explosion(){
    if(runningThis==true||skillEnergy<=3){
      return;
    }
    skillEnergy-=4;
    showSkillEnergy();
    const ctx = document.getElementById('battleArea4').getContext('2d');
    explosionMusic();
    for(i=0; i<=6; i++){
      myExplosionImage[i] = new Image();
      myExplosionImage[i].src = "players/폭발"+i+".PNG";
    }
    let num=0
    runningExplosion = setInterval(function(let){
      const ctx = document.getElementById('battleArea4').getContext('2d');
      const img = new Image();
      img.src = myExplosionImage[num].src;
      ctx.drawImage(img,210,25);
      if(num==6){
        clearInterval(runningExplosion);
        clearAnimation(4);
        damageToMonster(player.att*2.5);
        runningThis=false;
      }
      num++;
    },150)
  }
  function explosionMusic(){
    const audio = document.getElementById('explosionAudio');
    audio.volume = 0.4;
    if(audio.paused){
      audio.play();
    }else{
      audio.pause();
      audio.play();
      audio.currentTime = 0;
    }
  }
  function damageToMonster(damage){
    monster.hp-=damage;
    monster.hp= Math.floor(monster.hp);
    if(monster.hp>0){//몬스터가 죽지 않았다면
      showMonsterHp();
      monstersAttack();
    }
    else {
      monsterOrder+=1;
      appearNewMonster();
    }
  }
