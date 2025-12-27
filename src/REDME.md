📁 app → مسؤول عن الـ Application Wrapper

📁 core → كل الـ Logic العامة

📁 modules → كل الـ Features (dashboard – hr – chat – auth…)

📁 ui → كل الـ Components القابلة لإعادة الاستخدام

📁 assets → الـ Assets (images, icons, etc.)

hooks/ = مجلد بنحط فيه الـ Custom Hooks العامة اللي فيها لوجيك يتكرر في كذا صفحة (زي useAuth و usePermission و useLanguage و useWindowSize)، عشان نخلي الكود نظيف وسهل إعادة الاستخدام.