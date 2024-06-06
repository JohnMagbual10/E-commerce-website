// Table follows {
// following_user_id integer
// followed_user_id integer
// created_at timestamp 
// }

// Table users {
// id integer [primary key]
// username varchar
// password varchar
// email varchar
// first_name varchar
// last_name varchar
// address text
// phone_number varchar
// created_at timestamp
// updated_at timestamp
// is_admin boolean
// }

// Table categories {
// id integer [primary key]
// name varchar
// description text
// created_at timestamp
// updated_at timestamp
// }

// Table products {
// id integer [primary key]
// name varchar
// description text
// price decimal
// stock_quantity integer
// category_id integer
// created_at timestamp
// updated_at timestamp
// }

// Table orders {
// id integer [primary key]
// user_id integer
// order_date timestamp
// status varchar
// total_amount decimal
// shipping_address text
// billing_address text
// created_at timestamp
// updated_at timestamp
// }

// Table order_items {
// id integer [primary key]
// order_id integer
// product_id integer
// quantity integer
// unit_price decimal
// total_price decimal
// created_at timestamp
// updated_at timestamp
// }

// Table reviews {
// id integer [primary key]
// user_id integer
// product_id integer
// rating integer [note: '1 to 5 stars']
// comment text
// created_at timestamp
// updated_at timestamp
// }

// Table payments {
// id integer [primary key]
// order_id integer
// payment_method varchar
// amount decimal
// payment_date timestamp
// status varchar
// created_at timestamp
// updated_at timestamp
// }

// Table wishlists {
// id integer [primary key]
// user_id integer
// created_at timestamp
// updated_at timestamp
// }

// Table wishlist_items {
// id integer [primary key]
// wishlist_id integer
// product_id integer
// created_at timestamp
// updated_at timestamp
// }

// Table coupons {
// id integer [primary key]
// code varchar
// discount_percentage decimal
// expiration_date date
// created_at timestamp
// updated_at timestamp
// }

// Table product_images {
// id integer [primary key]
// product_id integer
// image_url text
// created_at timestamp
// updated_at timestamp
// }

// References
// Ref: follows.following_user_id > users.id
// Ref: follows.followed_user_id > users.id
// Ref: products.category_id > categories.id // many-to-one
// Ref: orders.user_id > users.id // many-to-one
// Ref: order_items.order_id > orders.id // many-to-one
// Ref: order_items.product_id > products.id // many-to-one
// Ref: reviews.user_id > users.id // many-to-one
// Ref: reviews.product_id > products.id // many-to-one
// Ref: payments.order_id > orders.id // many-to-one
// Ref: wishlists.user_id > users.id // many-to-one
// Ref: wishlist_items.wishlist_id > wishlists.id // many-to-one
// Ref: wishlist_items.product_id > products.id // many-to-one
// Ref: product_images.product_id > products.id // many-to-one
