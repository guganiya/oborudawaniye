import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
	en: {
		translation: {
			//navbar
			nav_home: 'Home',
			nav_products: 'Products',
			nav_innovation: 'Innovation',
			nav_support: 'Support',
			nav_news: 'News',
			nav_about: 'About Us',
			nav_contacts: 'Contacts',
			nav_signup: 'Sign Up',
			nav_logo_alt: 'Alyx Logo',
			lang_en: 'English',
			lang_ru: 'Russian',
			lang_tk: 'Turkmen',

			//404
			'404_error_found': 'Error Found',
			'404_title_part1': 'Lost in light',
			'404_title_dot': '.',
			'404_description':
				'The page you are looking for does not exist or has been moved to another section.',
			'404_btn_home': 'To Home',
			'404_btn_back': 'Go Back',

			//footer
			footer_logo_alt: 'AlyX Logo',
			footer_description:
				'World leader in moving light technology. High-quality products for concerts, theaters, and television.',
			footer_sec_products: 'News',
			footer_sec_company: 'Company',
			footer_sec_support: 'Support',
			footer_link_moving_lights: 'Moving Lights',
			footer_link_static_lights: 'Static Lights',
			footer_link_digital_lighting: 'Digital Lighting',
			footer_link_controllers: 'Controllers',
			footer_link_about: 'About Us',
			footer_link_sustainability: 'Products',
			footer_link_innovation: 'Innovation',
			footer_link_careers: 'News',
			footer_link_service: 'Service & Repair',
			footer_link_manuals: 'Manuals',
			footer_link_training: 'Training',
			footer_link_contact: 'Contact Us',
			footer_copyright: '© 2026 AlyX LIGHTING. ALL RIGHTS RESERVED.',
			footer_back_to_top: 'Back to Top',

			//contact
			contacts_bg_text: 'Contact',
			contacts_hero_title_1: 'Get in',
			contacts_hero_title_2: 'Touch',
			contacts_hero_desc:
				'Have a project in mind? Our global support network is ready to bring your vision to life with professional lighting solutions.',
			contacts_label_email: 'Email Us',
			contacts_label_call: 'Call Us',
			contacts_label_office: 'Office',
			contacts_label_hours: 'Hours',
			contacts_value_hours: 'Mon - Fri: 08:00 - 17:00',
			contacts_form_title: 'Send a',
			contacts_form_title_accent: 'Message',
			contacts_form_subtitle: 'We typically respond within 24 hours.',
			contacts_input_name: 'Full Name',
			contacts_input_email: 'Email Address',
			contacts_input_message: 'Message',
			contacts_btn_send: 'Send Request',
			contacts_btn_sending: 'SENDING...',
			contacts_err_fill_all: 'Please fill in all fields',
			contacts_err_email_invalid: 'Please enter a valid email address',
			contacts_err_generic: 'Something went wrong. Please try again.',
			contacts_success_msg:
				'Message sent successfully! We will contact you soon.',
			contacts_modal_success_title: 'Success!',
			contacts_modal_error_title: 'Error!',
			contacts_modal_btn_continue: 'Continue',
			contacts_modal_btn_retry: 'Try Again',

			//Home-new
			news_main_title: 'News',
			news_btn_more: 'Learn More',

			//Home-newsletter
			newsletter_title: 'Newsletter',
			newsletter_subtitle: 'Stay up to date with our news. Register now!',
			newsletter_btn_signup: 'Sign Up',

			//Home-videosection
			video_title: 'video',
			video_loading: 'Loading...',
			video_no_data: 'No videos found',
			video_btn_prev: 'previous',
			video_btn_next: 'next',
			video_not_supported: 'Your browser does not support the video tag.',

			//Home-hero
			hero_btn_more: 'Read More',

			//innovation-content
			innovation_loading: 'Loading innovation...',
			innovation_err_load: 'Failed to load innovation',
			innovation_not_found: 'Innovation not found',
			innovation_back_to_list: 'Back to innovations',
			innovation_related_products: 'Related products',
			innovation_products_coming_soon:
				'Products with this technology coming soon',

			//innovation
			innovations_watermark: 'Innovations',
			innovations_title_main: 'Innovations',
			innovations_subtitle:
				'AlyX has developed several patented technological solutions to ensure superior quality and performance of fixtures. Patents and trademarks © AlyX lighting s.r.o',
			innovations_loading: 'Loading technologies...',
			innovations_loading_more: 'Loading more...',
			innovations_empty: 'Nothing found',
			innovations_all_loaded: 'All loaded ({{count}} innovations)',
			innovations_btn_more: 'Load more',

			//news-newsgallery
			gallery_no_images: 'No images available',
			gallery_untitled: 'Untitled',
			gallery_prev: 'back',
			gallery_next: 'next',

			//news-newsgridcard
			news_category_default: 'Procurement',

			//news
			news_watermark: 'News',
			news_title_main: 'News',
			news_filter_categories: 'Categories',
			news_filter_all: 'All Categories',
			news_filter_clear: 'Clear all',
			news_filter_btn_reset: 'Clear filters',
			news_active_filters: 'Active filters',
			news_loading: 'Loading news...',
			news_loading_more: 'Loading more...',
			news_empty: 'Nothing found',
			news_all_loaded: 'All loaded ({{count}} news)',
			news_btn_more_news: 'Load more',
			news_read_more: 'Read more',
			news_category_default_news: 'News',
			news_default_subject: 'General',

			//news-newscontent
			news_products_in_article: 'Products in this article',
			news_related_title: 'Related news',
			news_all_btn: 'All news',

			//signup
			auth_signup_title: 'Create Account',
			auth_signup_subtitle: 'Join our professional lighting network',
			auth_field_fullname: 'Full Name',
			auth_field_email: 'Email Address',
			auth_btn_register: 'Register',
			auth_btn_processing: 'PROCESSING...',
			auth_error_fill_fields: 'Please fill in all fields',
			auth_error_invalid_email: 'Please enter a valid email address',
			auth_error_general: 'Something went wrong. Please try again.',
			auth_success_signup:
				'Account created successfully! Please check your email.',
			modal_success_title: 'Success!',
			modal_error_title: 'Error!',
			modal_btn_continue: 'Continue',
			modal_btn_retry: 'Try Again',

			//about
			about_hero_bg: 'About Us',
			about_title: 'About us',
			about_description:
				'We create lighting solutions that transform ordinary spaces into unforgettable visual experiences. Innovation is in our DNA, and quality is our top priority.',
			stats_years: 'Years of exp',
			stats_patents: 'Patents',
			stats_countries: 'Countries',
			stats_clients: 'Clients',
			about_mission_label: 'Our Mission',
			about_mission_title: 'Lighting the future',
			about_mission_text:
				'Founded in the heart of Europe, the company has grown from a small workshop to a world leader in intelligent lighting equipment. We believe that light is not just a tool, but a way to communicate and create emotions.',
			about_team_label: 'Our Team',
			about_team_title: 'Leaders in their field',
			about_team_subtitle:
				'Professionals with years of experience, united by a common passion for light and innovation',
			about_loading_team: 'Loading team...',
			about_team_empty: 'Team is growing...',
			about_values_label: 'Our Values',
			about_values_title: 'What drives us',
			about_error_load: 'Failed to load team',

			//product-detail
			product_no_description: 'No description available',
			product_not_found: 'Product not found',
			product_back_home: 'Return to homepage',
			product_back: 'Back',
			product_short_desc: 'Short Description',
			product_size: 'Size',
			product_date: 'Date',
			product_hide: 'Hide',
			product_read_more: 'Read More',
			product_innovations: 'Innovations',
			product_added: 'Added',

			//product-download
			dl_title: 'Downloads',
			dl_empty_msg: 'No documents available for this product yet.',
			dl_support_btn: 'Go to Support Center',
			dl_subtitle:
				'Find and download all technical and marketing documents related to this product.',
			dl_count_label: 'Documents',
			dl_success_msg: 'downloaded successfully',
			dl_fail_msg: 'Failed to download',
			dl_tooltip: 'Click to download',
			dl_support_label: 'Support',
			dl_cat_technical: 'Technical Data',
			dl_cat_marketing: 'Marketing',
			dl_cat_certificates: 'Certificates',
			dl_cat_documentation: 'Documentation',
			dl_cat_software: 'Software',
			dl_cat_cad_files: 'CAD Files',
			dl_cat_libraries: 'Libraries',
			dl_cat_dmx_charts: 'DMX Charts',
			dl_cat_gobos: 'Gobos',
			dl_cat_photometrics: 'Photometrics',
			dl_cat_measurements: 'Measurements',
			dl_cat_documents: 'Documents',

			//product-videos
			video_no_video: 'No videos',
			video_coming_soon: 'Video materials are coming soon',
			video_title_1: 'Products',
			video_title_2: 'In Frame',
			video_subtitle:
				'See our products in action and appreciate the quality of performance.',
			video_tag_featured: 'Featured',
			video_next: 'Next video',
			video_next_btn: 'Next',

			//products
			catalog_bg_text: 'Catalog',
			catalog_title: 'Catalog',
			catalog_subtitle: 'Professional Lighting Equipment',
			catalog_search_placeholder: 'Search categories...',
			catalog_no_results: 'No results for',
			catalog_card_tag: 'Category',
			catalog_card_desc: 'View all products in this category',
			catalog_error_fetch: 'Failed to load categories. Please try again later.',

			//subcategory
			subcat_error_fetch: 'Failed to load subcategories.',
			subcat_default_parent: 'Catalog',
			subcat_breadcrumb_catalog: 'Catalog',
			subcat_search_placeholder: 'Search subcategories...',
			subcat_subtitle: 'Select a section of interest',
			subcat_card_tag: 'Subcategory',
			subcat_card_desc: 'Show equipment in section',
			subcat_no_results: 'Subcategory not found',

			//subcatproduct
			products_catalog: 'Catalog',
			products_loading: 'Loading...',
			products_breadcrumb_catalog: 'Catalog',
			products_search_placeholder: 'Search model...',
			products_loading_text: 'Loading products...',
			products_end_of_catalog: 'End of catalog',
			products_count_label: 'models',

			//support
			support_title: 'Support Center',
			support_search_placeholder: 'Search documentation and files...',
			support_search_btn: 'Search',
			support_loading: 'Searching files...',
			support_found_count: 'Files found',
			support_no_results: 'No results found',
			support_start_typing: 'Start typing to search',
			support_results_title: 'Search Results',
			support_download_btn: 'Download',
			support_error_fetch: 'Failed to load files.',
			support_error_download: 'Failed to download file.',

			search: {
				bg_text: 'Search',
				title: 'Explore',
				placeholder: 'WHAT ARE YOU LOOKING FOR?',
				filter_category: '01. Category',
				filter_subcategory: '02. Subcategory',
				filter_size: '03. Size',
				select_placeholder: 'Select...',
				no_matches: 'No matches',
				active_filters: 'Active filters',
				chip_search: 'Search',
				chip_category: 'Category',
				chip_subcategory: 'Subcategory',
				chip_size: 'Size',
				clear_all: 'Clear all',
				loading: 'Loading products...',
				loading_more: 'Loading more...',
				no_products: 'No products found',
				awaiting_params: 'Awaiting specific parameters',
				clear_filters_btn: 'Clear filters',
				all_loaded: 'All loaded ({{count}} products)',
			},
		},
	},
	ru: {
		translation: {
			//navbar
			nav_home: 'Главная',
			nav_products: 'Продукты',
			nav_innovation: 'Инновации',
			nav_support: 'Поддержка',
			nav_news: 'Новости',
			nav_about: 'О нас',
			nav_contacts: 'Контакты',
			nav_signup: 'Регистрация',
			nav_logo_alt: 'Логотип Alyx',
			lang_en: 'Английский',
			lang_ru: 'Русский',
			lang_tk: 'Туркменский',

			//404
			'404_error_found': 'Ошибка обнаружена',
			'404_title_part1': 'Затерянный в свете',
			'404_title_dot': '.',
			'404_description':
				'Страница, которую вы ищете, не существует или была перемещена в другой раздел.',
			'404_btn_home': 'На главную',
			'404_btn_back': 'Вернуться назад',

			//footer
			footer_logo_alt: 'Логотип Alyx',
			footer_description:
				'Мировой лидер в технологии управляемого света. Высококачественные продукты для концертов, театров и телевидения.',
			footer_sec_products: 'Новости',
			footer_sec_company: 'Компания',
			footer_sec_support: 'Поддержка',
			footer_link_moving_lights: 'Вращающиеся головы',
			footer_link_static_lights: 'Статический свет',
			footer_link_digital_lighting: 'Цифровой свет',
			footer_link_controllers: 'Контроллеры',
			footer_link_about: 'О нас',
			footer_link_sustainability: 'Продукты',
			footer_link_innovation: 'Инновации',
			footer_link_careers: 'Новости',
			footer_link_service: 'Сервис и ремонт',
			footer_link_manuals: 'Инструкции',
			footer_link_training: 'Обучение',
			footer_link_contact: 'Связаться с нами',
			footer_copyright: '© 2026 AlyX LIGHTING. ВСЕ ПРАВА ЗАЩИЩЕНЫ.',
			footer_back_to_top: 'Наверх',

			//contact
			contacts_bg_text: 'Контакт',
			contacts_hero_title_1: 'Будьте на',
			contacts_hero_title_2: 'Связи',
			contacts_hero_desc:
				'У вас есть проект? Наша глобальная сеть поддержки готова воплотить ваше видение в жизнь с помощью профессиональных световых решений.',
			contacts_label_email: 'Напишите нам',
			contacts_label_call: 'Позвоните нам',
			contacts_label_office: 'Офис',
			contacts_label_hours: 'Часы работы',
			contacts_value_hours: 'Пн - Пт: 08:00 - 17:00',
			contacts_form_title: 'Отправить',
			contacts_form_title_accent: 'Сообщение',
			contacts_form_subtitle: 'Обычно мы отвечаем в течение 24 часов.',
			contacts_input_name: 'Полное имя',
			contacts_input_email: 'Электронная почта',
			contacts_input_message: 'Сообщение',
			contacts_btn_send: 'Отправить запрос',
			contacts_btn_sending: 'ОТПРАВКА...',
			contacts_err_fill_all: 'Пожалуйста, заполните все поля',
			contacts_err_email_invalid: 'Пожалуйста, введите корректный email адрес',
			contacts_err_generic:
				'Что-то пошло не так. Пожалуйста, попробуйте снова.',
			contacts_success_msg:
				'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
			contacts_modal_success_title: 'Успешно!',
			contacts_modal_error_title: 'Ошибка!',
			contacts_modal_btn_continue: 'Продолжить',
			contacts_modal_btn_retry: 'Попробовать снова',

			//Home-new
			news_main_title: 'Новости',
			news_btn_more: 'Узнать больше',

			//Home-newsletter
			newsletter_title: 'Новостная рассылка',
			newsletter_subtitle:
				'Будьте в курсе наших новостей. Зарегистрируйтесь сейчас!',
			newsletter_btn_signup: 'Зарегистрироваться',

			//Home-videosection
			video_title: 'видео',
			video_loading: 'Загрузка...',
			video_no_data: 'Нет видео',
			video_btn_prev: 'предыдущее',
			video_btn_next: 'следующее',
			video_not_supported: 'Ваш браузер не поддерживает видео тег.',

			//Home-hero
			hero_btn_more: 'Подробнее',

			//innovation-content
			innovation_loading: 'Загрузка инновации...',
			innovation_err_load: 'Не удалось загрузить инновацию',
			innovation_not_found: 'Инновация не найдена',
			innovation_back_to_list: 'Назад к инновациям',
			innovation_related_products: 'Связанные продукты',
			innovation_products_coming_soon:
				'Продукты с этой технологией появятся скоро',

			//innovation
			innovations_watermark: 'Innovations',
			innovations_title_main: 'Инновации',
			innovations_subtitle:
				'AlyX разработали несколько запатентованных технологических решений для обеспечения превосходного качества и работы приборов. Патенты и торговые марки © AlyX lighting s.r.o',
			innovations_loading: 'Загрузка технологий...',
			innovations_loading_more: 'Загружаем ещё...',
			innovations_empty: 'Ничего не найдено',
			innovations_all_loaded: 'Все загружено ({{count}} инноваций)',
			innovations_btn_more: 'Загрузить еще',

			//news-newsgallery
			gallery_no_images: 'Изображения отсутствуют',
			gallery_untitled: 'Без названия',
			gallery_prev: 'назад',
			gallery_next: 'далее',

			//news-newsgridcard
			news_category_default: 'Закупки',

			//news
			news_watermark: 'Новости',
			news_title_main: 'Новости',
			news_filter_categories: 'Категории',
			news_filter_all: 'Все категории',
			news_filter_clear: 'Очистить все',
			news_filter_btn_reset: 'Очистить фильтры',
			news_active_filters: 'Активные фильтры',
			news_loading: 'Загрузка новостей...',
			news_loading_more: 'Загружаем ещё...',
			news_empty: 'Ничего не найдено',
			news_all_loaded: 'Все загружено ({{count}} новостей)',
			news_btn_more_news: 'Загрузить еще',
			news_read_more: 'Читать далее',
			news_category_default_news: 'Новости',
			news_default_subject: 'Общее',

			//news-newscontent
			news_products_in_article: 'Продукты в данной статье',
			news_related_title: 'Связанные новости',
			news_all_btn: 'Все новости',

			//signup
			auth_signup_title: 'Создать аккаунт',
			auth_signup_subtitle: 'Присоединяйтесь к нашей профессиональной сети',
			auth_field_fullname: 'Полное имя',
			auth_field_email: 'Электронная почта',
			auth_btn_register: 'Регистрация',
			auth_btn_processing: 'ОБРАБОТКА...',
			auth_error_fill_fields: 'Пожалуйста, заполните все поля',
			auth_error_invalid_email: 'Пожалуйста, введите корректный email',
			auth_error_general: 'Что-то пошло не так. Попробуйте снова.',
			auth_success_signup:
				'Аккаунт успешно создан! Пожалуйста, проверьте почту.',
			modal_success_title: 'Успешно!',
			modal_error_title: 'Ошибка!',
			modal_btn_continue: 'Продолжить',
			modal_btn_retry: 'Попробовать снова',

			//about
			about_hero_bg: 'О Нас',
			about_title: 'О нас',
			about_description:
				'Мы создаем световые решения, которые превращают обычные пространства в незабываемые визуальные впечатления. Инновации — это наше ДНК, а качество — главный приоритет.',
			stats_years: 'Лет опыта',
			stats_patents: 'Патентов',
			stats_countries: 'Стран',
			stats_clients: 'Клиентов',
			about_mission_label: 'Наша миссия',
			about_mission_title: 'Освещаем будущее',
			about_mission_text:
				'Основанная в сердце Европы, компания прошла путь от небольшой мастерской до мирового лидера в производстве интеллектуального светового оборудования. Мы верим, что свет — это не просто инструмент, а способ коммуникации и создания эмоций.',
			about_team_label: 'Наша команда',
			about_team_title: 'Лидеры своего дела',
			about_team_subtitle:
				'Профессионалы с многолетним опытом, объединенные общей страстью к свету и инновациям',
			about_loading_team: 'Загрузка команды...',
			about_team_empty: 'Команда пополняется...',
			about_values_label: 'Наши ценности',
			about_values_title: 'Что движет нами',
			about_error_load: 'Не удалось загрузить команду',

			//product-detail
			product_no_description: 'Описание отсутствует',
			product_not_found: 'Товар не найден',
			product_back_home: 'Вернуться на главную',
			product_back: 'Назад',
			product_short_desc: 'Краткое описание',
			product_size: 'Размер',
			product_date: 'Дата',
			product_hide: 'Скрыть',
			product_read_more: 'Читать далее',
			product_innovations: 'Инновации',
			product_added: 'Добавлено',

			//product-download
			dl_title: 'Загрузки',
			dl_empty_msg: 'Для данного продукта пока нет доступных документов.',
			dl_support_btn: 'В центр поддержки',
			dl_subtitle:
				'Найдите и скачайте все технические и маркетинговые документы, относящиеся к этому продукту.',
			dl_count_label: 'Документов',
			dl_success_msg: 'успешно скачан',
			dl_fail_msg: 'Ошибка при скачивании',
			dl_tooltip: 'Нажмите, чтобы скачать',
			dl_support_label: 'Поддержка',
			dl_cat_technical: 'Технические данные',
			dl_cat_marketing: 'Маркетинг',
			dl_cat_certificates: 'Сертификаты',
			dl_cat_documentation: 'Инструкции',
			dl_cat_software: 'ПО и Обновления',
			dl_cat_cad_files: 'CAD Файлы',
			dl_cat_libraries: 'Библиотеки',
			dl_cat_dmx_charts: 'DMX Таблицы',
			dl_cat_gobos: 'Гобо',
			dl_cat_photometrics: 'Фотометрия',
			dl_cat_measurements: 'Измерения шума',
			dl_cat_documents: 'Документы',

			//product-videos
			video_no_video: 'Нет видео',
			video_coming_soon: 'Видео материалы скоро появятся',
			video_title_1: 'Продукты',
			video_title_2: 'в кадре',
			video_subtitle:
				'Посмотрите наши товары в действии и оцените качество исполнения.',
			video_tag_featured: 'Рекомендуемое',
			video_next: 'Следующее видео',
			video_next_btn: 'Вперед',

			//products
			catalog_bg_text: 'Каталог',
			catalog_title: 'Каталог',
			catalog_subtitle: 'Профессиональное световое оборудование',
			catalog_search_placeholder: 'Поиск по категории...',
			catalog_no_results: 'Нет результатов для',
			catalog_card_tag: 'Категория',
			catalog_card_desc: 'Просмотр всех товаров в данной категории',
			catalog_error_fetch:
				'Не удалось загрузить категории. Пожалуйста, попробуйте позже.',

			//subcategory
			subcat_error_fetch: 'Не удалось загрузить подкатегории.',
			subcat_default_parent: 'Каталог',
			subcat_breadcrumb_catalog: 'Каталог',
			subcat_search_placeholder: 'Поиск подкатегории...',
			subcat_subtitle: 'Выберите интересующий раздел',
			subcat_card_tag: 'Подкатегория',
			subcat_card_desc: 'Показать оборудование в разделе',
			subcat_no_results: 'Подкатегория не найдена',

			//subcatproduct
			products_catalog: 'Каталог',
			products_loading: 'Загрузка...',
			products_breadcrumb_catalog: 'Каталог',
			products_search_placeholder: 'Поиск модели...',
			products_loading_text: 'Загрузка товаров...',
			products_end_of_catalog: 'Конец каталога',
			products_count_label: 'моделей',

			//support
			support_title: 'Центр поддержки',
			support_search_placeholder: 'Поиск по документации и файлам...',
			support_search_btn: 'Найти',
			support_loading: 'Поиск файлов...',
			support_found_count: 'Найдено файлов',
			support_no_results: 'Ничего не найдено',
			support_start_typing: 'Начните вводить текст для поиска',
			support_results_title: 'Результаты поиска',
			support_download_btn: 'Скачать',
			support_error_fetch: 'Не удалось загрузить файлы.',
			support_error_download: 'Не удалось скачать файл.',

			search: {
				bg_text: 'Поиск',
				title: 'Поиск',
				placeholder: 'ЧТО ВЫ ИЩЕТЕ?',
				filter_category: '01. Категория',
				filter_subcategory: '02. Подкатегория',
				filter_size: '03. Размер',
				select_placeholder: 'Выбрать...',
				no_matches: 'Нет совпадений',
				active_filters: 'Активные фильтры',
				chip_search: 'Поиск',
				chip_category: 'Категория',
				chip_subcategory: 'Подкатегория',
				chip_size: 'Размер',
				clear_all: 'Очистить все',
				loading: 'Загрузка товаров...',
				loading_more: 'Загрузка еще...',
				no_products: 'Товары не найдены',
				awaiting_params: 'Ожидание параметров поиска',
				clear_filters_btn: 'Сбросить фильтры',
				all_loaded: 'Загружено всё ({{count}} товаров)',
			},
		},
	},
	tk: {
		translation: {
			search: {
				bg_text: 'Gözleg',
				title: 'Gözleg',
				placeholder: 'NÄME GÖZLEÝÄRSIŇIZ?',
				filter_category: '01. Kategoriýa',
				filter_subcategory: '02. Kiçi kategoriýa',
				filter_size: '03. Ölçeg',
				select_placeholder: 'Saýla...',
				no_matches: 'Gözleg tapylmady',
				active_filters: 'Işjeň filtrler',
				all_loaded: 'Hemmesi ýüklendi ({{count}} haryt)',
			},
			//navbar
			nav_home: 'Baş sahypa',
			nav_products: 'Önümler',
			nav_innovation: 'Innowasiýa',
			nav_support: 'Goldaw',
			nav_news: 'Täzelikler',
			nav_about: 'Biz barada',
			nav_contacts: 'Habarlaşmak',
			nav_signup: 'Agza bol',
			nav_logo_alt: 'Alyx Logotipi',
			lang_en: 'Iňlis dili',
			lang_ru: 'Rus dili',
			lang_tk: 'Türkmen dili',

			//404
			'404_error_found': 'Ýalňyşlyk tapyldy',
			'404_title_part1': 'Yşykda ýitirim bolan',
			'404_title_dot': '.',
			'404_description':
				'Siziň gözleýän sahypaňyz ýok ýa-da başga bölüme geçirildi.',
			'404_btn_home': 'Baş sahypa',
			'404_btn_back': 'Yza dönmek',

			//footer
			footer_logo_alt: 'Alyx Logotipi',
			footer_description:
				'Öwrülýän yşyk tehnologiýasynda dünýä lideri. Konsertler, teatrlary we telewideniýe üçin ýokary hilli önümler.',
			footer_sec_products: 'Täzelikler',
			footer_sec_company: 'Kompaniýa',
			footer_sec_support: 'Goldaw',
			footer_link_moving_lights: 'Öwrülýän yşyklar',
			footer_link_static_lights: 'Statik yşyklar',
			footer_link_digital_lighting: 'Sanly yşyklandyryş',
			footer_link_controllers: 'Kontrollerler',
			footer_link_about: 'Biz barada',
			footer_link_sustainability: 'Önümler',
			footer_link_innovation: 'Innowasiýa',
			footer_link_careers: 'Täzelikler',
			footer_link_service: 'Hyzmat we abatlaýyş',
			footer_link_manuals: 'Gollanmalar',
			footer_link_training: 'Okuw',
			footer_link_contact: 'Habarlaşmak',
			footer_copyright: '© 2026 AlyX LIGHTING. ÄHLI HUKUKLAR GORALANDYR.',
			footer_back_to_top: 'Ýokaryk',

			//contact
			contacts_bg_text: 'Habarlaşmak',
			contacts_hero_title_1: 'Biz bilen',
			contacts_hero_title_2: 'Habarlaşyň',
			contacts_hero_desc:
				'Taslamaňyz barmy? Biziň global goldaw ulgamymyz hünär derejeli yşyklandyryş çözgütleri bilen siziň garaýyşlaryňyzy durmuşa geçirmäge taýýar.',
			contacts_label_email: 'E-poçta ýazyň',
			contacts_label_call: 'Jaň ediň',
			contacts_label_office: 'Ofis',
			contacts_label_hours: 'Iş wagty',
			contacts_value_hours: 'Duş - Juma: 08:00 - 17:00',
			contacts_form_title: 'Habar',
			contacts_form_title_accent: 'Iber',
			contacts_form_subtitle: 'Biz adatça 24 sagadyň dowamynda jogap berýäris.',
			contacts_input_name: 'Doly adyňyz',
			contacts_input_email: 'E-poçta adresiňiz',
			contacts_input_message: 'Habaryňyz',
			contacts_btn_send: 'Sorag ugrat',
			contacts_btn_sending: 'IBERILÝÄR...',
			contacts_err_fill_all: 'Ähli öýjükleri doldurmagyňyzy haýyş edýäris',
			contacts_err_email_invalid: 'Dogry e-poçta adresini giriziň',
			contacts_err_generic:
				'Näsazlyk ýüze çykdy. Täzeden synanyşmagyňyzy haýyş edýäris.',
			contacts_success_msg:
				'Habaryňyz üstünlikli ugradyldy! Ýakyn wagtda size jogap bereris.',
			contacts_modal_success_title: 'Üstünlikli!',
			contacts_modal_error_title: 'Näsazlyk!',
			contacts_modal_btn_continue: 'Dowam et',
			contacts_modal_btn_retry: 'Täzeden synanyş',

			//Home-new
			news_main_title: 'Täzelikler',
			news_btn_more: 'Has köp bilmek',

			//Home-newsletter
			newsletter_title: 'Täzelikler haty',
			newsletter_subtitle:
				'Täzeliklerimizden habardar boluň. Häzir hasaba alynyň!',
			newsletter_btn_signup: 'Hasaba alynmak',

			//Home-videosection
			video_title: 'wideo',
			video_loading: 'Ýüklenýär...',
			video_no_data: 'Wideo ýok',
			video_btn_prev: 'öňki',
			video_btn_next: 'indiki',
			video_not_supported: 'Siziň brauzeriňiz wideo formatyny goldamaýar.',

			//Home-hero
			hero_btn_more: 'Giňişleýin',

			//innovation-content
			innovation_loading: 'Innowasiýa ýüklenýär...',
			innovation_err_load: 'Innowasiýany ýükläp bolmady',
			innovation_not_found: 'Innowasiýa tapylmady',
			innovation_back_to_list: 'Innowasiýalara dolan',
			innovation_related_products: 'Degişli önümler',
			innovation_products_coming_soon:
				'Bu tehnologiýaly önümler ýakyn wagtda geler',

			//innovation
			innovations_watermark: 'Innovations',
			innovations_title_main: 'Innowasiýalar',
			innovations_subtitle:
				'AlyX, enjamlaryň ýokary hilli we öndürijilikli işlemegini üpjün etmek üçin birnäçe patentli tehnologiki çözgütleri işläp düzdi. Patentler we söwda belgileri © AlyX lighting s.r.o',
			innovations_loading: 'Tehnologiýalar ýüklenýär...',
			innovations_loading_more: 'Has köp ýüklenýär...',
			innovations_empty: 'Hiç zat tapylmady',
			innovations_all_loaded: 'Ählisi ýüklendi ({{count}} innowasiýa)',
			innovations_btn_more: 'Has köp ýükle',

			//news-newsgallery
			gallery_no_images: 'Surat ýok',
			gallery_untitled: 'Sözbaşysyz',
			gallery_prev: 'yzyna',
			gallery_next: 'öňe',

			//news-newsgridcard
			news_category_default: 'Satyn almalar',

			//news
			news_watermark: 'Habarlar',
			news_title_main: 'Habarlar',
			news_filter_categories: 'Kategoriýalar',
			news_filter_all: 'Ähli kategoriýalar',
			news_filter_clear: 'Ählisini arassala',
			news_filter_btn_reset: 'Süzgüçleri arassala',
			news_active_filters: 'Aktiw süzgüçler',
			news_loading: 'Habarlar ýüklenýär...',
			news_loading_more: 'Has köp ýüklenýär...',
			news_empty: 'Hiç zat tapylmady',
			news_all_loaded: 'Ählisi ýüklendi ({{count}} habar)',
			news_btn_more_news: 'Has köp ýükle',
			news_read_more: 'Dowamyny oka',
			news_category_default_news: 'Habar',
			news_default_subject: 'Umumy',

			//news-newscontent
			news_products_in_article: 'Bu maddyýatdaky önümler',
			news_related_title: 'Degişli habarlar',
			news_all_btn: 'Ähli habarlar',

			//signup
			auth_signup_title: 'Hasap döretmek',
			auth_signup_subtitle: 'Professional torumyza goşulyň',
			auth_field_fullname: 'Doly ady',
			auth_field_email: 'E-poçta adresi',
			auth_btn_register: 'Hasaba durmak',
			auth_btn_processing: 'IŞLENILÝÄR...',
			auth_error_fill_fields: 'Ähli meýdançalary dolduryň',
			auth_error_invalid_email: 'Dogry e-poçta adresini giriziň',
			auth_error_general: 'Näsazlyk ýüze çykdy. Täzeden synanyşyň.',
			auth_success_signup: 'Hasap üstünlikli döredildi! E-poçtaňyzy barlaň.',
			modal_success_title: 'Üstünlikli!',
			modal_error_title: 'Näsazlyk!',
			modal_btn_continue: 'Dowam et',
			modal_btn_retry: 'Täzeden synanyş',

			//about
			about_hero_bg: 'Biz Barada',
			about_title: 'Biz barada',
			about_description:
				'Biz adaty ýerleri unudylmaz wizual tejribelere öwürýän yşyklandyryş çözgütlerini döredýäris. Innowasiýa biziň DNK-myzdyr, hil bolsa esasy ileri tutulýan ugurymyzdyr.',
			stats_years: 'Ýyl tejribe',
			stats_patents: 'Patentler',
			stats_countries: 'Ýurtlar',
			stats_clients: 'Müşderiler',
			about_mission_label: 'Biziň missiýamyz',
			about_mission_title: 'Geljegi ýagtylandyrýarys',
			about_mission_text:
				'Ýewropanyň merkezinde esaslandyrylan kompaniýa, kiçijik ussahanadan intellektual yşyklandyryş enjamlaryny öndürmekde dünýä liderine çenli ýol geçdi. Biz yşygyň diňe bir gural däl, eýsem aragatnaşyk we duýgy döretmek usulydygyna ynanýarys.',
			about_team_label: 'Biziň toparymyz',
			about_team_title: 'Öz işiniň ussatlary',
			about_team_subtitle:
				'Yşyga we innowasiýalara bolan umumy höwes bilen birleşen köp ýyllyk tejribesi bolan hünärmenler',
			about_loading_team: 'Topar ýüklenilýär...',
			about_team_empty: 'Topar täzelenýär...',
			about_values_label: 'Biziň gymmatlyklarymyz',
			about_values_title: 'Bizi näme ruhlandyrýar',
			about_error_load: 'Topary ýükläp bolmady',

			//product-detail
			product_no_description: 'Mazmuny ýok',
			product_not_found: 'Haryt tapylmady',
			product_back_home: 'Baş sahypa dolanmak',
			product_back: 'Yza',
			product_short_desc: 'Gysgaça mazmuny',
			product_size: 'Ölçegi',
			product_date: 'Senesi',
			product_hide: 'Gizlemek',
			product_read_more: 'Dowamyny oka',
			product_innovations: 'Innowasiýalar',
			product_added: 'Goşuldy',

			//product-download
			dl_title: 'Ýüklemeler',
			dl_empty_msg: 'Bu haryt üçin heniz resminama ýok.',
			dl_support_btn: 'Goldaw merkezine gitmek',
			dl_subtitle:
				'Bu haryt bilen baglanyşykly ähli tehniki we mahabat resminamalaryny tapyň we ýükläň.',
			dl_count_label: 'Resminamalar',
			dl_success_msg: 'üstünlikli ýüklendi',
			dl_fail_msg: 'Ýüklemek başa barmady',
			dl_tooltip: 'Ýüklemek üçin basyň',
			dl_support_label: 'Goldaw',
			dl_cat_technical: 'Tehniki maglumatlar',
			dl_cat_marketing: 'Mahabat',
			dl_cat_certificates: 'Şahadatnamalar',
			dl_cat_documentation: 'Gollanmalar',
			dl_cat_software: 'Programma üpjünçiligi',
			dl_cat_cad_files: 'CAD faýllary',
			dl_cat_libraries: 'Kitaphanalar',
			dl_cat_dmx_charts: 'DMX tablisalary',
			dl_cat_gobos: 'Gobo',
			dl_cat_photometrics: 'Fotometriýa',
			dl_cat_measurements: 'Ses ölçegleri',
			dl_cat_documents: 'Resminamalar',

			//product-videos
			video_no_video: 'Wideo ýok',
			video_coming_soon: 'Wideo materiallar basym goşular',
			video_title_1: 'Harytlar',
			video_title_2: 'kadarda',
			video_subtitle:
				'Harytlarymyzyň işleýşini görüň we ýerine ýetiriş kalitesine baha beriň.',
			video_tag_featured: 'Saýlanan',
			video_next: 'Indiki wideo',
			video_next_btn: 'Öňe',

			//products
			catalog_bg_text: 'Katalog',
			catalog_title: 'Katalog',
			catalog_subtitle: 'Professional yşyklandyryş enjamlary',
			catalog_search_placeholder: 'Kategoriýa boýunça gözleg...',
			catalog_no_results: 'Gözleg netijesi ýok',
			catalog_card_tag: 'Kategoriýa',
			catalog_card_desc: 'Bu kategoriýadaky ähli harytlary gör',
			catalog_error_fetch: 'Kategoriýalary ýükläp bolmady. Soňrak synanyşyň.',

			//subcategory
			subcat_error_fetch: 'Kiçi kategoriýalary ýükläp bolmady.',
			subcat_default_parent: 'Katalog',
			subcat_breadcrumb_catalog: 'Katalog',
			subcat_search_placeholder: 'Kiçi kategoriýa gözleg...',
			subcat_subtitle: 'Gyzyklandyrýan bölümi saýlaň',
			subcat_card_tag: 'Kiçi kategoriýa',
			subcat_card_desc: 'Bölümdäki enjamlary görkez',
			subcat_no_results: 'Kiçi kategoriýa tapylmady',

			//subcatproduct
			products_catalog: 'Katalog',
			products_loading: 'Ýüklenýär...',
			products_breadcrumb_catalog: 'Katalog',
			products_search_placeholder: 'Model gözleg...',
			products_loading_text: 'Harytlar ýüklenýär...',
			products_end_of_catalog: 'Kataloguň soňy',
			products_count_label: 'model',

			//support
			support_title: 'Goldaw merkezi',
			support_search_placeholder: 'Resminamalar we faýllar boýunça gözleg...',
			support_search_btn: 'Tap',
			support_loading: 'Faýllar gözlenilýär...',
			support_found_count: 'Tapylan faýllar',
			support_no_results: 'Hiç zat tapylmady',
			support_start_typing: 'Gözlemek üçin ýazyp başlaň',
			support_results_title: 'Gözleg netijeleri',
			support_download_btn: 'Ýükle',
			support_error_fetch: 'Faýllary ýükläp bolmady.',
			support_error_download: 'Faýly ýükläp bolmady.',
		},
	},
}
i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources, // добавляем наши тексты
		supportedLngs: ['en', 'ru', 'tk'],
		fallbackLng: 'en',

		// Настройки детектора (необязательно, но полезно)
		detection: {
			order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
			caches: ['localStorage'], // сохраняем выбор пользователя здесь
		},

		interpolation: {
			escapeValue: false, // React и так защищает от XSS
		},
	})

export default i18n
