<script setup lang="ts">
import { ref, computed } from "vue";
import BookingModal from "../../shared/BookingModal.vue";

const props = defineProps<{
  lang: string;
  i18n?: Record<string, any>;
}>();

const email = ref("");
const selectedServices = ref<string[]>([]);
const showModal = ref(false);

const t = (key: string, fallback: string = key) => {
  if (!props.i18n) return fallback;
  const keys = key.split('.');
  let value: any = props.i18n;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback;
  }
  return value;
};

const services = computed(() => [
  { id: "web", label: t('marketing_card.services.web', 'Diseño Web'), icon: "tabler:world" },
  { id: "ecommerce", label: t('marketing_card.services.ecommerce', 'E-commerce'), icon: "tabler:shopping-cart" },
  { id: "seo", label: t('marketing_card.services.seo', 'SEO'), icon: "tabler:rocket" },
  { id: "ads", label: t('marketing_card.services.ads', 'Publicidad'), icon: "tabler:speakerphone" },
  { id: "social", label: t('marketing_card.services.social', 'Social Media'), icon: "tabler:brand-meta" },
  { id: "branding", label: t('marketing_card.services.branding', 'Branding'), icon: "tabler:palette" },
]);

// Initialize with first service
if (selectedServices.value.length === 0 && services.value.length > 0) {
  selectedServices.value = [services.value[0].label];
}

const toggleService = (label: string) => {
  const index = selectedServices.value.indexOf(label);
  if (index === -1) {
    selectedServices.value.push(label);
  } else {
    if (selectedServices.value.length > 1) {
      selectedServices.value.splice(index, 1);
    }
  }
};

const handleSubmit = () => {
  if (!email.value) return;
  showModal.value = true;
};

const handleBookingSuccess = () => {
  showModal.value = false;
  email.value = "";
  if (services.value.length > 0) {
    selectedServices.value = [services.value[0].label];
  }
};

const getIconSvg = (iconName: string) => {
  const icons: Record<string, string> = {
    "tabler:world":
      '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 0 0 18" /></svg>',
    "tabler:shopping-cart":
      '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17h-11v-14h-2M6 5l14 1l-1 7h-13" /></svg>',
    "tabler:rocket":
      '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>',
    "tabler:speakerphone":
      '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8a3 3 0 0 1 0 6M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" /></svg>',
    "tabler:brand-meta":
      '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10.174c1.766 -2.784 3.315 -4.174 4.648 -4.174c2 0 3.263 2.213 4 5.217c.704 2.869 .5 6.783 -2 6.783c-1.114 0 -2.648 -1.565 -4.148 -3.652a27.627 27.627 0 0 1 -2.5 -4.174zM12 10.174c-1.766 -2.784 -3.315 -4.174 -4.648 -4.174c-2 0 -3.263 2.213 -4 5.217c-.704 2.869 -.5 6.783 2 6.783c1.114 0 2.648 -1.565 4.148 -3.652c1 -1.391 1.833 -2.783 2.5 -4.174z" /></svg>',
    "tabler:palette":
      '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>',
  };
  return icons[iconName] || "";
};
</script>

<template>
  <div class="relative max-w-lg group">
    <!-- Decorative background elements -->
    <div
      class="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20"
    >
      <h2
        class="text-3xl lg:text-4xl font-black text-neutral-800 mb-2 tracking-tight"
      >
        {{ t('marketing_card.title', 'Crea tu proyecto') }}
      </h2>
      <p class="text-neutral-500 font-medium mb-8">{{ t('marketing_card.subtitle', '¿Con qué necesitas ayuda?') }}</p>

      <div class="flex flex-wrap gap-3 mb-10">
        <button
          v-for="service in services"
          :key="service.id"
          @click="toggleService(service.label)"
          :class="[
            'px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border-2',
            selectedServices.includes(service.label)
              ? 'bg-[#FF8A00] border-transparent text-white shadow-lg shadow-orange-100 scale-105'
              : 'bg-white border-neutral-100 text-neutral-500 hover:border-orange-200',
          ]"
        >
          <span v-html="getIconSvg(service.icon)"></span>
          {{ service.label }}
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="relative">
          <input
            v-model="email"
            type="email"
            :placeholder="t('marketing_card.email_placeholder', 'Tu mejor correo electrónico')"
            required
            class="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[#FF8A00] transition-all font-bold text-neutral-800 placeholder:text-neutral-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#FF8A00] text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:bg-[#e67e00] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <span>{{ t('marketing_card.cta', 'Iniciar mi proyecto') }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </form>
    </div>

    <!-- Floating elements for extra "wow" -->
    <div
      class="absolute -top-6 -right-6 w-12 h-12 bg-orange-400 rounded-2xl rotate-12 animate-pulse opacity-50 hidden sm:block"
    ></div>
    <div
      class="absolute -bottom-10 -left-10 w-20 h-20 bg-emerald-400 rounded-full blur-2xl opacity-20 animate-pulse hidden sm:block"
    ></div>

    <!-- Booking Modal -->
    <BookingModal
      :is-open="showModal"
      :initial-email="email"
      :selected-services="selectedServices"
      :lang="lang"
      :i18n="i18n"
      @close="showModal = false"
      @success="handleBookingSuccess"
      client:load
    />
  </div>
</template>
