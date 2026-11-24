-- ============================================================
--  گیمزل | راه‌اندازی اولیه دیتابیس D1
--  این فایل را در کنسول دیتابیس (D1 → gamezel-db → Console) اجرا کنید.
--  قابل اجرای مجدد است (IF NOT EXISTS / OR IGNORE).
-- ============================================================

-- ---------- جدول‌ها ----------

CREATE TABLE IF NOT EXISTS `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `categories_slug_unique` ON `categories` (`slug`);

CREATE TABLE IF NOT EXISTS `credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`order_item_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `credentials_listing_id_idx` ON `credentials` (`listing_id`);

CREATE TABLE IF NOT EXISTS `games` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`english_title` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` text,
	`description` text DEFAULT '' NOT NULL,
	`features` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE UNIQUE INDEX IF NOT EXISTS `games_slug_unique` ON `games` (`slug`);
CREATE INDEX IF NOT EXISTS `games_category_id_idx` ON `games` (`category_id`);

CREATE TABLE IF NOT EXISTS `images` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_type` text NOT NULL,
	`owner_id` text NOT NULL,
	`mime` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`data` blob NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE INDEX IF NOT EXISTS `images_owner_idx` ON `images` (`owner_type`,`owner_id`);

CREATE TABLE IF NOT EXISTS `listings` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`specs` text DEFAULT '{}' NOT NULL,
	`price` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `listings_game_id_idx` ON `listings` (`game_id`);

CREATE TABLE IF NOT EXISTS `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`listing_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`price_each` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE INDEX IF NOT EXISTS `order_items_order_id_idx` ON `order_items` (`order_id`);

CREATE TABLE IF NOT EXISTS `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`total_price` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `orders_user_id_idx` ON `orders` (`user_id`);

CREATE TABLE IF NOT EXISTS `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`mime` text NOT NULL,
	`data` blob NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `receipts_order_id_idx` ON `receipts` (`order_id`);

CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `sessions_user_id_idx` ON `sessions` (`user_id`);

CREATE TABLE IF NOT EXISTS `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);

-- ---------- داده‌های اولیه ----------

INSERT OR IGNORE INTO `categories` (`id`, `name`, `slug`, `sort_order`) VALUES
	('cat-steam', 'استیم', 'steam', 1),
	('cat-epic', 'اپیک گیمز', 'epic', 2),
	('cat-riot', 'ریوت گیمز', 'riot', 3),
	('cat-battlenet', 'بتل‌نت', 'battlenet', 4);

INSERT OR IGNORE INTO `games` (`id`, `title`, `english_title`, `slug`, `category_id`, `description`, `features`, `sort_order`) VALUES
	('game-dota2', 'دوتا ۲', 'DOTA 2', 'dota-2', 'cat-steam',
	 'انواع اکانت دوتا ۲ با رنک‌های مختلف، تحویل فوری بعد از تایید پرداخت.',
	 '["تحویل فوری","ضمانت اصالت اکانت","پشتیبانی ۲۴/۷"]', 1),
	('game-gta5', 'GTA V', 'GTA V', 'gta-v', 'cat-steam',
	 'اکانت اورجینال جی‌تی‌ای ۵ با دسترسی کامل و بدون بن.',
	 '["تحویل فوری","اکانت اورجینال","تغییر ایمیل توسط شما"]', 2),
	('game-fc27', 'FC 27', 'FC 27', 'fc-27', 'cat-steam',
	 'اکانت فیفا ۲۷ برای تجربه آنلاین و آفلاین با قیمت مناسب.',
	 '["تحویل فوری","قیمت مناسب","پشتیبانی ۲۴/۷"]', 3),
	('game-valorant', 'ولورانت', 'VALORANT', 'valorant', 'cat-riot',
	 'اکانت ولورانت با اسکین و رنک‌های متنوع، تحویل سریع.',
	 '["تحویل فوری","ضمانت اصالت","پشتیبانی ۲۴/۷"]', 4);

INSERT OR IGNORE INTO `settings` (`key`, `value`) VALUES
	('card_number', ''),
	('card_holder', ''),
	('bank_name', ''),
	('telegram_id', ''),
	('order_notice', 'بعد از پرداخت، عکس رسید را در سبد خرید خود آپلود کنید تا سفارش شما بررسی شود.');

-- ادمین پیش‌فرض — بعد از اولین ورود رمز را عوض کنید
INSERT OR IGNORE INTO `users` (`id`, `email`, `password_hash`, `name`, `role`) VALUES
	('admin-001', 'admin@gamezel.com',
	 'pbkdf2$100000$35c19dca560a433922bcf73986132126$f0b86b951b021ecebdd6d1f9b4114867ef82c28cf03537eda0494162cea377e5',
	 'مدیر فروشگاه', 'admin');
