<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { supabase } from "../../lib/supabase";

const props = defineProps<{
  initialEmail?: string;
  selectedServices?: string[];
  lang?: string;
  embedded?: boolean;
  i18n?: Record<string, any>;
}>();

const emit = defineEmits(["success"]);

const step = ref(1);
const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);
const isSubmitting = ref(false);
const isSuccess = ref(false);

const form = ref({
  name: "",
  email: props.initialEmail || "",
  company: "",
  phone: "",
  country_code: "+591",
});

// Weeks navigation
const currentWeekOffset = ref(0);

const t = (key: string, fallback?: string | string[] | null) => {
  if (!props.i18n) return fallback;
  const keys = key.split(".");
  let value: any = props.i18n;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback;
  }
  return value;
};

const daysOfWeek = computed(() => {
  const days = t("booking.flow.days", null);
  return Array.isArray(days)
    ? days
    : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
});

const months = computed(() => {
  const monthsArray = t("booking.flow.months", null);
  return Array.isArray(monthsArray)
    ? monthsArray
    : [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
});

const weekDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - today.getDay() + currentWeekOffset.value * 7
  );

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();

    days.push({
      date,
      dayName: daysOfWeek.value[date.getDay()],
      dayNumber: date.getDate(),
      monthName: months.value[date.getMonth()],
      isPast,
      isToday,
      isSelected: selectedDate.value?.getTime() === date.getTime(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }
  return days;
});

const availableTimes = computed(() => {
  if (!selectedDate.value) return [];

  const now = new Date();
  const selected = new Date(selectedDate.value);
  const isToday = selected.toDateString() === now.toDateString();

  const allTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  if (!isToday) return allTimes;

  // Filter out past times for today
  return allTimes.filter((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const timeDate = new Date(selected);
    timeDate.setHours(hours, minutes, 0, 0);
    return timeDate > now;
  });
});

const selectDay = (day: any) => {
  if (day.isPast || day.isWeekend) return;
  selectedDate.value = day.date;
  selectedTime.value = null;
};

const selectTime = (time: string) => {
  selectedTime.value = time;
  setTimeout(() => {
    step.value = 2;
  }, 300);
};

const nextWeek = () => {
  currentWeekOffset.value++;
};

const prevWeek = () => {
  if (currentWeekOffset.value > 0) {
    currentWeekOffset.value--;
  }
};

const currentMonthYear = computed(() => {
  if (weekDays.value.length === 0) return "";
  const firstDay = weekDays.value[0].date;
  return `${months.value[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
});

// Country selector
const countries = [
  { code: "BO", name: "Bolivia", dial: "+591", flag: "🇧🇴" },
  { code: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
  { code: "US", name: "USA", dial: "+1", flag: "🇺🇸" },
  { code: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "PE", name: "Perú", dial: "+51", flag: "🇵🇪" },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪" },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { code: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾" },
  { code: "PA", name: "Panamá", dial: "+507", flag: "🇵🇦" },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
  { code: "DO", name: "Rep. Dominicana", dial: "+1", flag: "🇩🇴" },
  { code: "GT", name: "Guatemala", dial: "+502", flag: "🇬🇹" },
  { code: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳" },
  { code: "SV", name: "El Salvador", dial: "+503", flag: "🇸🇻" },
  { code: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮" },
  { code: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
  { code: "CA", name: "Canadá", dial: "+1", flag: "🇨🇦" },
  { code: "PR", name: "Puerto Rico", dial: "+1", flag: "🇵🇷" },
  { code: "CU", name: "Cuba", dial: "+53", flag: "🇨🇺" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "FR", name: "Francia", dial: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italia", dial: "+39", flag: "🇮🇹" },
  { code: "DE", name: "Alemania", dial: "+49", flag: "🇩🇪" },
  { code: "GB", name: "Reino Unido", dial: "+44", flag: "🇬🇧" },
];

const selectedCountry = ref(countries[0]);
const showCountries = ref(false);
const countrySearch = ref("");

const filteredCountries = computed(() => {
  if (!countrySearch.value) return countries;
  const s = countrySearch.value.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(s) ||
      c.dial.includes(s) ||
      c.code.toLowerCase().includes(s)
  );
});

const selectCountry = (c: (typeof countries)[0]) => {
  selectedCountry.value = c;
  form.value.country_code = c.dial;
  showCountries.value = false;
  countrySearch.value = "";
};

const handlePhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, "");
  form.value.phone = input.value;
};

const handleConfirm = async () => {
  if (!selectedDate.value || !selectedTime.value) return;

  isSubmitting.value = true;

  const scheduledAt = new Date(selectedDate.value);
  const [hours, minutes] = selectedTime.value.split(":");
  scheduledAt.setHours(parseInt(hours), parseInt(minutes));

  const { error } = await supabase.from("leads").insert([
    {
      name: form.value.name,
      email: form.value.email,
      company: form.value.company,
      phone: `${form.value.country_code} ${form.value.phone}`,
      whatsapp: form.value.phone,
      country_code: form.value.country_code,
      service: props.selectedServices?.join(", ") || "General",
      source: props.embedded ? "conversational_wizard" : "booking_modal",
      status: "pending",
      scheduled_at: scheduledAt.toISOString(),
      details: {
        selected_services: props.selectedServices,
        lang: props.lang,
        raw_phone: form.value.phone,
      },
    },
  ]);

  isSubmitting.value = false;

  if (error) {
    console.error("Error booking meeting:", error);
    alert("Hubo un error al agendar la reunión. Inténtalo de nuevo.");
  } else {
    // Show success message
    isSuccess.value = true;
    
    // Wait 2 seconds before emitting success event
    setTimeout(() => {
      emit("success", {
        scheduled_at: scheduledAt.toISOString(),
        name: form.value.name,
        email: form.value.email,
      });
    }, 2000);
  }
};

onMounted(() => {
  const firstAvailable = weekDays.value.find((d) => !d.isPast && !d.isWeekend);
  if (firstAvailable) {
    selectedDate.value = firstAvailable.date;
  }
});
</script>

<template>
  <div class="booking-flow">
    <!-- Step 1: Calendar & Time -->
    <Transition name="slide-up" mode="out-in">
      <div v-if="step === 1" key="step1" class="space-y-8">
        <!-- Week Navigator -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-neutral-800">{{
              currentMonthYear
            }}</span>
            <div class="flex gap-2">
              <button
                @click="prevWeek"
                :disabled="currentWeekOffset === 0"
                class="p-2 border border-neutral-100 rounded-xl hover:bg-neutral-50 disabled:opacity-30 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                @click="nextWeek"
                class="p-2 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <button
              v-for="day in weekDays"
              :key="day.date.toISOString()"
              @click="selectDay(day)"
              :disabled="day.isPast || day.isWeekend"
              :class="[
                'flex flex-col items-center p-3 rounded-2xl transition-all duration-300 border-2',
                day.isSelected
                  ? 'bg-[#FF8A00] border-transparent text-white shadow-lg shadow-orange-100 scale-105'
                  : day.isPast || day.isWeekend
                  ? 'bg-neutral-50 border-transparent text-neutral-300 cursor-not-allowed opacity-50'
                  : 'bg-white border-neutral-50 text-neutral-600 hover:border-orange-200',
              ]"
            >
              <span
                class="text-[10px] font-black uppercase tracking-widest mb-1"
                >{{ day.dayName }}</span
              >
              <span class="text-xl font-black">{{ day.dayNumber }}</span>
            </button>
          </div>
        </div>

        <!-- Time Slots -->
        <Transition name="fade-in">
          <div v-if="selectedDate" class="space-y-4">
            <h3
              class="text-sm font-black text-neutral-400 uppercase tracking-widest"
            >
              {{ t("booking.flow.available_times", "Horarios disponibles") }}
            </h3>
            <div
              v-if="availableTimes.length > 0"
              class="grid grid-cols-3 sm:grid-cols-4 gap-3"
            >
              <button
                v-for="time in availableTimes"
                :key="time"
                @click="selectTime(time)"
                :class="[
                  'py-3 rounded-xl font-bold transition-all duration-300 border-2 text-center text-sm',
                  selectedTime === time
                    ? 'bg-[#FF8A00] border-transparent text-white shadow-md'
                    : 'bg-neutral-50 border-transparent text-neutral-600 hover:border-orange-200 hover:bg-white',
                ]"
              >
                {{ time }}
              </button>
            </div>
            <div v-else class="text-center py-8 text-neutral-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="font-bold">
                {{
                  t(
                    "booking.flow.no_times_today",
                    "No hay horarios disponibles para hoy"
                  )
                }}
              </p>
              <p class="text-sm">
                {{
                  t(
                    "booking.flow.select_another_day",
                    "Por favor selecciona otro día"
                  )
                }}
              </p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Success Message -->
      <div v-else-if="isSuccess" key="success" class="text-center py-8">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-neutral-800 mb-2">{{ t('booking.flow.success.title', '¡Reunión confirmada!') }}</h3>
        <p class="text-neutral-600">{{ t('booking.flow.success.subtitle', 'Te contactaremos pronto') }}</p>
      </div>

      <!-- Step 2: Form -->
      <div v-else key="step2" class="space-y-6">
        <div
          class="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex flex-col gap-4 mb-4"
        >
          <div class="w-full flex justify-between">
            <div
              class="w-12 h-12 bg-[#FF8A00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100"
            >
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
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <button
              @click="step = 1"
              class="ml-auto text-sm font-bold text-neutral-400 hover:text-neutral-600 underline"
            >
              {{ t("booking.flow.change", "Cambiar") }}
            </button>
          </div>
          <div>
            <div
              class="text-sm font-black text-[#FF8A00] uppercase tracking-widest"
            >
              {{ t("booking.flow.meeting_scheduled", "Reunión Agendada") }}
            </div>
            <div class="text-xl font-bold text-neutral-800">
              {{ weekDays.find((d) => d.isSelected)?.dayName }},
              {{ selectedDate?.getDate() }} de
              {{ weekDays.find((d) => d.isSelected)?.monthName }} a las
              {{ selectedTime }}
            </div>
          </div>
        </div>

        <form @submit.prevent="handleConfirm" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                class="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1"
                >{{
                  t("booking.flow.form.full_name", "Nombre completo")
                }}</label
              >
              <input
                v-model="form.name"
                type="text"
                required
                :placeholder="
                  t('booking.flow.form.full_name_placeholder', 'Ej. Juan Pérez')
                "
                class="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF8A00] transition-all font-bold text-neutral-800"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1"
                >{{ t("booking.flow.form.email", "Correo electrónico") }}</label
              >
              <input
                v-model="form.email"
                type="email"
                required
                :placeholder="
                  t('booking.flow.form.email_placeholder', 'nombre@empresa.com')
                "
                class="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF8A00] transition-all font-bold text-neutral-800"
              />
            </div>
          </div>
          <!-- <div class="grid sm:grid-cols-2 gap-4"> -->
          <div class="space-y-2">
            <label
              class="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1"
              >{{
                t("booking.flow.form.company", "Nombre de la empresa")
              }}</label
            >
            <input
              v-model="form.company"
              type="text"
              :placeholder="
                t('booking.flow.form.company_placeholder', 'Ej. Ganex Studio')
              "
              class="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF8A00] transition-all font-bold text-neutral-800"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1"
              >{{ t("booking.flow.form.phone", "Teléfono / WhatsApp") }}</label
            >
            <div class="flex gap-2">
              <div class="relative">
                <button
                  type="button"
                  @click="showCountries = !showCountries"
                  class="h-full flex items-center gap-2 px-4 rounded-2xl border-2 border-neutral-100 bg-white hover:bg-neutral-50 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span class="text-xl">{{ selectedCountry.flag }}</span>
                  <span class="font-bold text-neutral-700">{{
                    selectedCountry.dial
                  }}</span>
                </button>

                <div
                  v-if="showCountries"
                  @click="showCountries = false"
                  class="fixed inset-0 z-10"
                ></div>

                <div
                  v-if="showCountries"
                  class="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-20"
                >
                  <div class="p-2 border-b border-neutral-100 bg-neutral-50/50">
                    <input
                      v-model="countrySearch"
                      type="text"
                      :placeholder="
                        t('booking.flow.form.search_country', 'Buscar país...')
                      "
                      class="w-full px-3 py-2 text-sm bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      @click.stop
                    />
                  </div>
                  <div class="max-h-60 overflow-y-auto">
                    <button
                      v-for="c in filteredCountries"
                      :key="c.code"
                      type="button"
                      @click="selectCountry(c)"
                      class="w-full flex items-center gap-3 p-4 hover:bg-orange-50 transition-all text-left border-b border-neutral-50 last:border-0"
                    >
                      <span class="text-2xl">{{ c.flag }}</span>
                      <div class="flex flex-col">
                        <span class="font-bold text-neutral-800">{{
                          c.name
                        }}</span>
                        <span class="text-xs text-neutral-400">{{
                          c.dial
                        }}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <input
                :value="form.phone"
                @input="handlePhoneInput"
                type="tel"
                required
                :placeholder="
                  t('booking.flow.form.phone_placeholder', '+591 ...')
                "
                class="bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF8A00] transition-all w-full font-bold text-neutral-800"
              />
            </div>
          </div>
          <!-- </div> -->

          <div class="pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-[#FF8A00] text-white font-black text-xl py-5 rounded-3xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:bg-[#e67e00] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span
                v-if="isSubmitting"
                class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <span v-else>{{
                t("booking.flow.form.confirm", "Confirmar reunión")
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-in-enter-active {
  transition: opacity 0.5s ease 0.2s;
}
.fade-in-enter-from {
  opacity: 0;
}
</style>
