function MyClass(game){
  Phaser.Sprite.apply(this, arguments);
  game.add.existing(this);
}
MyClass.prototype = Object.create(Phaser.Sprite.prototype);
MyClass.prototype.constructor = MyClass;

var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'game', {
	preload: function preload() {
		game.load.atlasXML('blueSheet', 'UIpack/blueSheet.png', 'UIpack/blueSheet.xml');
	},
	create: function create() {
		game.plugins.add(Phaser.Plugin.Inspector);
		this.image = game.make.sprite(0, 0, 'blueSheet', 'blue_button02.png');
		this.image.anchor.set(0.5, 0.5);
		this.textureRender = game.add.renderTexture(game.width, game.height);
		this.textureRenderedSprite = game.add.sprite(0, 0, this.textureRender);

		this.myGroup = game.add.group();
		this.mySprite = new MyClass(game, 250, 150, 'blueSheet', 'blue_button02.png');
		this.mySprite.anchor.set(0.5, 0.5);
		this.myGroup.add(this.mySprite)
		this.mySprite2 = new MyClass(game, 350, 250, 'blueSheet', 'blue_button02.png');
		this.mySprite2.anchor.set(0.5, 0.5);
		this.myGroup.add(this.mySprite2)
	},
	update: function update() {
		var pointer = game.input.activePointer;
		if (!pointer.position.isZero()) {
			this.textureRender.renderXY(this.image, pointer.x, pointer.y, true);
		}
	}
})