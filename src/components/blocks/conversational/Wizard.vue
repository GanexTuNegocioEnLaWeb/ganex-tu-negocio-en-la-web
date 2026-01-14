<template>
  <div
    class="min-h-dvh flex flex-col bg-white overflow-hidden relative font-sans"
  >
    <!-- Header Minimal -->
    <header
      class="p-4 md:px-12 md:py-6 flex justify-between items-center z-20 sticky top-0 bg-white/80 backdrop-blur-md"
    >
      <a :href="`/${lang}`" class="w-60 transition-transform hover:scale-105">
        <img :src="logo" alt="Ganex Logo" class="w-full h-auto" />
      </a>

      <div class="flex items-center gap-4">
        <div
          v-if="step > 1 && step < 6"
          class="hidden md:block text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em]"
        >
          Paso {{ currentFlowStep }} / {{ totalFlowSteps }}
        </div>
      </div>
    </header>

    <!-- Progress Bar -->
    <div
      v-if="step < 6"
      class="absolute top-0 left-0 w-full h-1.5 bg-neutral-50 z-30"
    >
      <div
        class="h-full bg-gradient-to-r from-[#FF8A00] to-[#FFB25A] transition-all duration-700 ease-out"
        :style="{ width: `${(step / 6) * 100}%` }"
      ></div>
    </div>

    <!-- Main Content -->
    <main
      class="grow flex items-center justify-center p-4 md:p-6 relative z-10"
    >
      <transition
        mode="out-in"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <!-- STEP 1: HERO -->
        <div v-if="step === 1" key="step1" class="max-w-2xl text-center">
          <span
            class="inline-block px-4 py-1.5 bg-orange-50 text-[#FF8A00] text-xs font-bold rounded-full mb-6 uppercase tracking-widest animate-bounce"
          >
            {{ displayServiceLabel }}
          </span>
          <h1
            class="text-4xl md:text-7xl font-bold text-neutral-800 leading-[1.1] mb-6 tracking-tight"
          >
            {{ currentStep1Data.title }}
          </h1>
          <p
            class="text-lg md:text-2xl text-neutral-500 mb-10 max-w-lg mx-auto leading-relaxed"
          >
            {{ currentStep1Data.subtitle }}
          </p>
          <button
            @click="nextStep"
            class="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-[#FF8A00] rounded-full hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,138,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,138,0,0.5)] cursor-pointer"
          >
            {{ i18n.step1.cta }}
            <svg
              class="w-6 h-6 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        <!-- OPTIONS STEPS (2, 3, 4) -->
        <div
          v-else-if="step >= 2 && step <= 4"
          :key="`step${step}`"
          class="max-w-2xl w-full"
        >
          <div class="text-center mb-10 md:mb-12">
            <h2
              class="text-3xl md:text-5xl font-bold text-neutral-800 tracking-tight leading-tight"
            >
              {{ currentStepData.question }}
            </h2>
          </div>
          <div class="grid md:grid-cols-2 gap-4 md:gap-6">
            <button
              v-for="opt in currentStepData.options"
              :key="opt.id"
              @click="setField(currentStepKey, opt.label)"
              class="group relative flex flex-col p-6 rounded-3xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              :class="
                form[currentStepKey] === opt.label
                  ? 'border-[#FF8A00] bg-orange-50/50 shadow-xl shadow-orange-100'
                  : 'border-neutral-100 hover:border-[#FF8A00] bg-white shadow-sm'
              "
            >
              <div
                class="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center transition-colors shadow-inner"
                :class="
                  form[currentStepKey] === opt.label
                    ? 'bg-[#FF8A00] text-white'
                    : 'bg-neutral-50 text-neutral-400 group-hover:bg-white group-hover:text-[#ff7a00]'
                "
              >
                <component :is="getIcon(opt.icon)" class="w-8 h-8" />
              </div>
              <h3
                class="text-xl font-bold mb-2"
                :class="
                  form[currentStepKey] === opt.label
                    ? 'text-neutral-800'
                    : 'text-neutral-800'
                "
              >
                {{ opt.label }}
              </h3>
              <p
                class="text-sm font-medium leading-relaxed"
                :class="
                  form[currentStepKey] === opt.label
                    ? 'text-neutral-600'
                    : 'text-neutral-400'
                "
              >
                {{ opt.desc }}
              </p>

              <div
                class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                v-if="form[currentStepKey] !== opt.label"
              >
                <svg
                  class="w-5 h-5 text-[#ff7a00]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- STEP 5: CONFIDENCE -->
        <div v-else-if="step === 5" key="step5" class="max-w-xl text-center">
          <div class="mb-12">
            <div
              class="w-24 h-24 bg-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 shadow-lg shadow-orange-100"
            >
              <svg
                class="w-12 h-12 text-[#FF8A00]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2
              class="text-4xl md:text-6xl font-bold text-neutral-800 leading-tight mb-6 tracking-tight"
            >
              {{ currentStep5Data.title }}
            </h2>
            <p class="text-lg md:text-2xl text-neutral-500 font-medium">
              {{ currentStep5Data.subtitle }}
            </p>
          </div>
          <button
            @click="nextStep"
            class="px-12 py-5 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-neutral-200 cursor-pointer"
          >
            Continuar
          </button>
        </div>

        <!-- STEP 6: CAPTURA -->
        <div v-else-if="step === 6" key="step6" class="max-w-lg w-full">
          <div v-if="!submitted">
            <div class="text-center mb-8">
              <h2
                class="text-4xl md:text-5xl font-bold text-neutral-800 mb-4 tracking-tight"
              >
                {{ i18n.step6.title }}
              </h2>
              <p class="text-neutral-500 font-medium text-lg">
                {{ i18n.step6.subtitle }}
              </p>
            </div>

            <form @submit.prevent="submitLead" class="grid gap-6">
              <div class="relative">
                <input
                  v-model="form.name"
                  type="text"
                  required
                  :placeholder="i18n.step6.form.name_placeholder"
                  class="w-full p-5 pl-6 rounded-3xl border-2 border-neutral-100 focus:border-[#FF8A00] focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-neutral-800"
                />
                <div
                  class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="i18n.step6.form.email_placeholder"
                  class="w-full p-5 pl-6 rounded-3xl border-2 border-neutral-100 focus:border-[#FF8A00] focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-neutral-800"
                />
                <div
                  class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div class="relative">
                <input
                  v-model="form.company"
                  type="text"
                  :placeholder="i18n.step6.form.company_placeholder"
                  class="w-full p-5 pl-6 rounded-3xl border-2 border-neutral-100 focus:border-[#FF8A00] focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-neutral-800"
                />
                <div
                  class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div class="flex gap-2">
                <div class="relative">
                  <button
                    type="button"
                    @click="showCountries = !showCountries"
                    class="h-full flex items-center gap-2 px-4 rounded-3xl border-2 border-neutral-100 bg-white hover:bg-neutral-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span class="text-xl">{{ selectedCountry.flag }}</span>
                    <span class="font-bold text-neutral-700">{{ selectedCountry.dial }}</span>
                  </button>
                  
                  <div v-if="showCountries" @click="showCountries = false" class="fixed inset-0 z-10"></div>
                  
                  <div v-if="showCountries" class="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-20">
                    <div class="p-2 border-b border-neutral-100 bg-neutral-50/50">
                      <input 
                        v-model="countrySearch"
                        type="text"
                        :placeholder="lang === 'es' ? 'Buscar país...' : 'Search country...'"
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
                          <span class="font-bold text-neutral-800">{{ c.name }}</span>
                          <span class="text-xs text-neutral-400">{{ c.dial }}</span>
                        </div>
                      </button>
                      <div v-if="filteredCountries.length === 0" class="p-8 text-center text-sm text-neutral-400 italic">
                        {{ lang === 'es' ? 'No hay resultados' : 'No results found' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="relative flex-1">
                  <input
                    :value="form.whatsapp"
                    @input="handlePhoneInput"
                    type="tel"
                    required
                    :placeholder="i18n.step6.form.whatsapp_placeholder"
                    class="w-full p-5 pl-6 rounded-3xl border-2 border-neutral-100 focus:border-[#FF8A00] focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-neutral-800"
                  />
                  <div
                    class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 015.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-6 bg-[#FF8A00] text-white text-lg font-bold rounded-3xl hover:translate-y-[-2px] active:translate-y-[1px] transition-all shadow-[0_20px_50px_rgba(255,138,0,0.3)] disabled:opacity-50 cursor-pointer"
                :class="{ 'animate-pulse': loading }"
              >
                {{ loading ? "Enviando..." : i18n.step6.form.submit }}
              </button>

              <div class="flex items-center justify-center gap-3 mt-2">
                <span
                  class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                ></span>
                <p
                  class="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]"
                >
                  {{ i18n.step6.form.footer }}
                </p>
              </div>
            </form>
          </div>

          <div v-else class="text-center">
            <div
              class="w-28 h-28 bg-green-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100/50"
            >
              <svg
                class="w-14 h-14 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              class="text-5xl font-bold text-neutral-800 mb-6 tracking-tight"
            >
              {{ i18n.step6.success.title }}
            </h2>
            <p class="text-xl text-neutral-500 font-medium mb-12">
              {{ i18n.step6.success.subtitle }}
            </p>
            <a
              :href="`/${lang}`"
              class="inline-flex items-center gap-2 px-10 py-5 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-neutral-200"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Volver al inicio
            </a>
          </div>
        </div>
      </transition>
    </main>

    <!-- Navigation Footer -->
    <footer class="p-4 md:p-10 flex justify-between items-center z-20">
      <button
        v-if="step > 1 && step < 6 && !submitted"
        @click="prevStep"
        class="group text-neutral-400 font-bold hover:text-neutral-800 transition-all flex items-center cursor-pointer"
      >
        <div
          class="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center mr-2 group-hover:bg-neutral-100 transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
        </div>
        {{ i18n.back }}
      </button>
      <div v-else></div>

      <div class="flex gap-2">
        <div
          v-for="s in 6"
          :key="s"
          class="w-1.5 h-1.5 rounded-full transition-all duration-500"
          :class="step === s ? 'bg-[#FF8A00] w-6' : 'bg-neutral-200'"
        ></div>
      </div>
    </footer>

    <!-- Background Decoration -->
    <div
      class="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-orange-100/20 rounded-full blur-[120px] pointer-events-none -z-0"
    ></div>
    <div
      class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-50/40 rounded-full blur-[100px] pointer-events-none -z-0"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineComponent, h } from "vue";
import { supabase } from "../../../lib/supabase";

const props = defineProps({
  lang: { type: String, default: "es" },
  i18n: { type: Object, required: true },
  logo: { type: String, required: true },
  initialService: { type: String, default: "" },
  serviceLabel: { type: String, default: "" },
  serviceId: { type: String, default: "" },
});

const step = ref(1);
const loading = ref(false);
const submitted = ref(false);

const form = reactive({
  need: props.initialService,
  business_type: "",
  goal: "",
  name: "",
  email: "",
  whatsapp: "",
  company: "",
  country_code: "+591",
  service: props.initialService || "General",
  service_id: props.serviceId,
});

// Skip step 2 if service is already selected
onMounted(() => {
  if (props.initialService) {
    // Step 2 is 'need', but we already have it
  }
});

const totalFlowSteps = computed(() => {
  // We have 4 selection steps (2, 3, 4) + 1 capture step (6). Step 1 (Hero) and Step 5 (Confidence) are transitions.
  // Actually, let's just count the "interactive" steps:
  // Step 2: Need (if not pre-selected)
  // Step 3: Business Type
  // Step 4: Goal
  // Step 6: Capture
  // Total interactive steps = (initialService ? 3 : 4)
  return props.initialService ? 3 : 4;
});

const currentFlowStep = computed(() => {
  if (step.value === 6) return totalFlowSteps.value;
  if (step.value <= 1) return 0;
  if (step.value === 5) return props.initialService ? 2 : 3;
  
  // Steps 2, 3, 4
  if (props.initialService) return step.value - 2; // Step 3 -> 1, Step 4 -> 2
  return step.value - 1; // Step 2 -> 1, Step 3 -> 2, Step 4 -> 3
});

const currentStepKey = computed(() => {
  if (step.value === 2) return "need";
  if (step.value === 3) return "business_type";
  if (step.value === 4) return "goal";
  return "";
});

const activeServiceId = computed(() => form.service_id || props.serviceId);

const displayServiceLabel = computed(() => {
  if (props.serviceLabel) return props.serviceLabel;
  if (form.need) return form.need;
  return props.lang === 'es' ? 'Expertos en Conversión' : 'Conversion Experts';
});

const currentStep1Data = computed(() => {
  const sid = activeServiceId.value;
  if (sid && props.i18n.services && props.i18n.services[sid]?.step1) {
    return props.i18n.services[sid].step1;
  }
  return props.i18n.step1;
});

const currentStep5Data = computed(() => {
  const sid = activeServiceId.value;
  if (sid && props.i18n.services && props.i18n.services[sid]?.step5) {
    return props.i18n.services[sid].step5;
  }
  return props.i18n.step5;
});

const currentStepData = computed(() => {
  const sid = activeServiceId.value;
  if (sid && props.i18n.services && props.i18n.services[sid]) {
    const serviceSteps = props.i18n.services[sid];
    if (step.value === 2 && serviceSteps.step2) return serviceSteps.step2;
    if (step.value === 3 && serviceSteps.step3) return serviceSteps.step3;
    if (step.value === 4 && serviceSteps.step4) return serviceSteps.step4;
  }
  
  if (step.value === 2) return props.i18n.step2;
  if (step.value === 3) return props.i18n.step3;
  if (step.value === 4) return props.i18n.step4;
  return null;
});

const countries = [
  { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
  { code: 'ES', name: 'España', dial: '+34', flag: '🇪🇸' },
  { code: 'US', name: 'USA', dial: '+1', flag: '🇺🇸' },
  { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪' },
  { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
  { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
  { code: 'PA', name: 'Panamá', dial: '+507', flag: '🇵🇦' },
  { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
  { code: 'DO', name: 'Rep. Dominicana', dial: '+1', flag: '🇩🇴' },
  { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
  { code: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá', dial: '+1', flag: '🇨🇦' },
  { code: 'PR', name: 'Puerto Rico', dial: '+1', flag: '🇵🇷' },
  { code: 'CU', name: 'Cuba', dial: '+53', flag: '🇨🇺' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'FR', name: 'Francia', dial: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemania', dial: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧' },
  { code: 'CH', name: 'Suiza', dial: '+41', flag: '🇨🇭' },
  { code: 'SE', name: 'Suecia', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', dial: '+47', flag: '🇳🇴' },
  { code: 'NL', name: 'Países Bajos', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Bélgica', dial: '+32', flag: '🇧🇪' },
  { code: 'RU', name: 'Rusia', dial: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turquía', dial: '+90', flag: '🇹🇷' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japón', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', dial: '+82', flag: '🇰🇷' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nva. Zelanda', dial: '+64', flag: '🇳🇿' },
  { code: 'ZA', name: 'Sudáfrica', dial: '+27', flag: '🇿🇦' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'AE', name: 'EAU', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabia Saudita', dial: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
];

const selectedCountry = ref(countries[0]);
const showCountries = ref(false);

const countrySearch = ref('');

const filteredCountries = computed(() => {
  if (!countrySearch.value) return countries;
  const s = countrySearch.value.toLowerCase();
  return countries.filter(c => 
    c.name.toLowerCase().includes(s) || 
    c.dial.includes(s) || 
    c.code.toLowerCase().includes(s)
  );
});

const selectCountry = (c) => {
  selectedCountry.value = c;
  form.country_code = c.dial;
  showCountries.value = false;
  countrySearch.value = '';
};

const handlePhoneInput = (e) => {
  const input = e.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  form.whatsapp = input.value;
};

onMounted(() => {
  // Try to detect country from timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes('Europe/Madrid')) selectCountry(countries[1]);
  else if (tz.includes('America/New_York') || tz.includes('America/Los_Angeles')) selectCountry(countries[2]);
  else if (tz.includes('America/Mexico_City')) selectCountry(countries[3]);
  else if (tz.includes('America/Bogota')) selectCountry(countries[4]);
  else if (tz.includes('America/Argentina')) selectCountry(countries[5]);
  else if (tz.includes('America/Santiago')) selectCountry(countries[6]);
  else if (tz.includes('America/Lima')) selectCountry(countries[7]);
});

const nextStep = () => {
  if (step.value === 1 && props.initialService) {
    step.value = 3; // Skip Step 2 (Need selection)
  } else {
    step.value++;
  }
};

const prevStep = () => {
  if (step.value === 3 && props.initialService) {
    step.value = 1; // Go back to Hero, skipping Step 2
  } else {
    step.value--;
  }
};

const setField = (field, value) => {
  form[field] = value;
  
  // Update internal service_id if selecting from general flow
  if (step.value === 2 && !props.serviceId && currentStepData.value.options) {
     const opt = currentStepData.value.options.find(o => o.label === value);
     if (opt && opt.id && props.i18n.services?.[opt.id]) {
        form.service_id = opt.id;
        form.service = value; // Capturamos el nombre real del servicio
     }
  }

  // Scroll to top with smooth animation
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    nextStep();
  }, 400);
};

const changeLang = (newLang) => {
  if (newLang === props.lang) return;
  const url = new URL(window.location.href);
  const pathParts = url.pathname.split("/").filter(Boolean);

  // Simple redirect assuming structure /[lang]/page
  if (pathParts[0] === props.lang) {
    pathParts[0] = newLang;
    // Map common paths
    const pageSlug = pathParts[1];
    if (pageSlug === "empezar" && newLang === "en")
      pathParts[1] = "get-started";
    if (pageSlug === "get-started" && newLang === "es")
      pathParts[1] = "empezar";

    window.location.href = "/" + pathParts.join("/");
  }
};

const submitLead = async () => {
  loading.value = true;
  try {
    const payload = {
      name: form.name,
      email: form.email,
      phone: `${form.country_code} ${form.whatsapp}`,
      whatsapp: form.whatsapp,
      company: form.company,
      country_code: form.country_code,
      source: "wizard",
      status: "pending",
      need: form.need,
      business_type: form.business_type,
      goal: form.goal,
      service: form.service || form.need,
      service_id: form.service_id,
      details: {
        need: form.need,
        business_type: form.business_type,
        goal: form.goal,
        lang: props.lang,
        company: form.company,
        service: form.service,
        service_id: form.service_id,
        raw_phone: form.whatsapp
      }
    };

    const { error } = await supabase.from("leads").insert([payload]);

    if (error) throw error;

    submitted.value = true;
  } catch (e) {
    console.error("Error submitting lead:", e);
    alert("Hubo un error al enviar tus datos. Por favor, intenta de nuevo.");
  } finally {
    loading.value = false;
  }
};

// Simple Icon Resolver
const getIcon = (iconName) => {
  // Basic Tabler-like SVG icons
  const icons = {
    "tabler:world":
      '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 0 0 18" />',
    "tabler:chart-arrows":
      '<path d="M3 18l14 0" /><path d="M9 9l3 3l-3 3" /><path d="M14 15l3 3l-3 3" /><path d="M3 3l0 15" /><path d="M3 3l9 9" />',
    "tabler:filter":
      '<path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-2 2v-9l-4.414 -4.414a2 2 0 0 1 -.586 -1.414v-2.172z" />',
    "tabler:help":
      '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 17l0 .01" /><path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />',
    "tabler:rocket":
      '<path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" /><path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" /><path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />',
    "tabler:user":
      '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />',
    "tabler:building":
      '<path d="M3 21l18 0" /><path d="M9 8l1 0" /><path d="M9 12l1 0" /><path d="M9 16l1 0" /><path d="M14 8l1 0" /><path d="M14 12l1 0" /><path d="M14 16l1 0" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />',
    "tabler:id":
      '<path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 8l2 0" /><path d="M15 12l2 0" /><path d="M7 16l10 0" />',
    "tabler:users":
      '<path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />',
    "tabler:shopping-cart":
      '<path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" />',
    "tabler:search":
      '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" />',
    "tabler:robot":
      '<path d="M7 7h10v8a4 4 0 0 1 -4 4h-2a4 4 0 0 1 -4 -4z" /><path d="M12 7l1 -4m-1 4l-1 -4" /><path d="M11 7l.5 -1" /><path d="M18 13l2 .5" /><path d="M18 15l2 -.5" /><path d="M6 13l-2 .5" /><path d="M6 15l-2 -.5" /><path d="M9 11v1" /><path d="M15 11v1" />',
    "tabler:check": '<path d="M5 12l5 5l10 -10" />',
    "tabler:x": '<path d="M18 6l-12 12" /><path d="M6 6l12 12" />',
    "tabler:circle-dot": '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />',
    "tabler:target-arrow": '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 7a5 5 0 1 0 5 5" /><path d="M13 3.055a9 9 0 1 0 7.941 7.945" /><path d="M15 6v3h3l3 -3h-3v-3z" /><path d="M15 9l-3 3" />',
    "tabler:shopping-bag": '<path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" /><path d="M9 11v-5a3 3 0 0 1 6 0v5" />',
    "tabler:building-estate": '<path d="M3 21h18" /><path d="M19 21v-4" /><path d="M19 17a2 2 0 0 0 2 -2v-2a2 2 0 1 0 -4 0v2a2 2 0 0 0 2 2z" /><path d="M14 21v-14a3 3 0 0 0 -3 -3h-4a3 3 0 0 0 -3 3v14" /><path d="M9 17v4" /><path d="M8 13h2" /><path d="M8 9h2" />',
    "tabler:news": '<path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0V5a1 1 0 0 0 -1 -1H5a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11" /><path d="M8 8l4 0" /><path d="M8 12l4 0" /><path d="M8 16l4 0" />',
    "tabler:brand-android": '<path d="M7 10l0 4l-3 0l0 -4z" /><path d="M17 10l0 4l3 0l0 -4z" /><path d="M7 9c0 -4.8 8 -4.8 8 0" /><path d="M7 9l0 11l10 0l0 -11" /><path d="M9 20l0 3" /><path d="M15 20l0 3" /><path d="M10 14a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M14 14a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />',
    "tabler:brand-apple": '<path d="M9 9l.2 -4.51a1.2 1.2 0 0 1 1.2 -1.13c.4 0 .71 .18 .93 .48" /><path d="M12 9s0 -1.41 1.5 -2.13c.45 -.21 1.05 .21 1.05 .71" /><path d="M9 14.5c0 0 -1.5 0 -2.5 2.5c0 0 1.5 5.5 5.5 5.5c0 0 4 0 4 -3c0 0 -3 -2 -3 -5c0 0 1.5 -2.5 2 -4c0 0 -2 0 -3.5 2.5c0 0 -1.5 -3.5 -5 -3.5c0 0 -1 3.5 2.5 5.5" />',
    "tabler:devices-2": '<path d="M13 14H18V19H13z" /><path d="M18 10V5a2 2 0 0 0 -2 -2H6a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h4" /><path d="M9 18h0" /><path d="M10 21H18V16a2 2 0 1 0 -4 0v2z" />',
    "tabler:bulb": '<path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" />',
    "tabler:palette": '<path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" /><path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />',
    "tabler:brand-meta": '<path d="M12 10.111c-2.417 -2.667 -5.417 -2.667 -7.5 0c-2.083 2.667 -1.875 5.333 0 8c2.25 3.2 6 6.3 7.5 7.5c1.5 -1.2 5.25 -4.3 7.5 -7.5c1.875 -2.667 2.083 -5.333 0 -8c-2.083 -2.667 -5.083 -2.667 -7.5 0z" /><path d="M12 10.111c2.417 -2.667 5.417 -2.667 7.5 0c2.083 2.667 1.875 5.333 0 8c-2.25 3.2 -6 6.3 -7.5 7.5c-1.5 -1.2 -5.25 -4.3 -7.5 -7.5c-1.875 -2.667 -2.083 -5.333 0 -8c2.083 -2.667 5.083 -2.667 7.5 0z" />',
    "tabler:users-group": '<path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" />',
    "tabler:circles-relation": '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M14 14m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />',
    "tabler:trending-up": '<path d="M3 17l6 -6l4 4l8 -8" /><path d="M14 7l7 0l0 7" />',
    "tabler:crown": '<path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />',
    "tabler:map-pin": '<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.242 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />',
    "tabler:world-latitude": '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M4.6 7l14.8 0" /><path d="M3 12l18 0" /><path d="M4.6 17l14.8 0" />',
    "tabler:settings-automation": '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37.996 .608 2.296 .07 2.572 -1.065z" /><path d="M10 9v6l5 -3z" />',
    "tabler:device-laptop": '<path d="M3 19l18 0" /><path d="M5 6m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />',
    "tabler:brand-whatsapp": '<path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" /><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />',
    "tabler:cash": '<path d="M7 9m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2" />',
    "tabler:headset": '<path d="M4 14v-3a8 8 0 1 1 16 0v3" /><path d="M18 19c0 1.657 -2.686 3 -6 3" /><path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z" /><path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z" />',
    "tabler:code-dots": '<path d="M15 12h.01" /><path d="M12 12h.01" /><path d="M9 12h.01" /><path d="M6 19a2 2 0 0 1 -2 -2v-4l-1 -1l1 -1v-4a2 2 0 0 1 2 -2" /><path d="M18 19a2 2 0 0 0 2 -2v-4l1 -1l-1 -1v-4a2 2 0 0 0 -2 -2" />',
    "tabler:refresh": '<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />',
    "tabler:bolt": '<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />',
    "tabler:heart-rate-monitor": '<path d="M3 4m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" /><path d="M7 20h10" /><path d="M9 16v4" /><path d="M15 16v4" /><path d="M7 10h2l2 3l2 -6l1 3h3" />',
    "tabler:layout-dashboard": '<path d="M4 4h6v8h-6z" /><path d="M4 16h6v4h-6z" /><path d="M14 12h6v8h-6z" /><path d="M14 4h6v4h-6z" />',
    "tabler:browser": '<path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" /><path d="M4 8h16" /><path d="M8 4v4" />',
    "tabler:player-play": '<path d="M7 4v16l13 -8z" />',
    "tabler:fingerprint": '<path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" /><path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 .8 4" /><path d="M12 11v2a14 14 0 0 0 .8 5" /><path d="M8 15a18 18 0 0 0 .8 4" /><path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 1.1 -5" />',
    "tabler:shield-check": '<path d="M9 12l2 2l4 -4" /><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />',
    "tabler:bell": '<path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" />',
    "tabler:mail-forward": '<path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5" /><path d="M3 6l9 6l9 -6" /><path d="M15 18h6" /><path d="M18 15l3 3l-3 3" />',
    "tabler:calculator": '<path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M8 7h8v2h-8z" /><path d="M8 10h1v1h-1z" /><path d="M8 13h1v1h-1z" /><path d="M8 16h1v1h-1z" /><path d="M12 10h1v1h-1z" /><path d="M12 13h1v1h-1z" /><path d="M12 16h1v1h-1z" /><path d="M16 10h1v1h-1z" /><path d="M16 13h1v1h-1z" /><path d="M16 16h1v1h-1z" />',
    "tabler:moneybag": '<path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" /><path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />',
    "tabler:adjustments-check": '<path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v5" /><path d="M15 19l2 2l4 -4" />',
    "tabler:database": '<path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" /><path d="M4 6v6a8 3 0 0 0 16 0v-6" /><path d="M4 12v6a8 3 0 0 0 16 0v-6" />',
    "tabler:refresh-dot": '<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />',
    "tabler:article": '<path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" />',
    "tabler:anchor": '<path d="M12 9v12" /><path d="M4 13a8 8 0 0 0 16 0" /><path d="M20 13h-2" /><path d="M6 13h-2" /><path d="M12 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />',
    "tabler:alert-triangle": '<path d="M12 9v4" /><path d="M12 17h.01" /><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />',
    "tabler:award": '<path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" /><path d="M12 15l3.4 5.89l1.59 -3.23l3.51 .01l-2.5 -4.67" /><path d="M12 15l-3.4 5.89l-1.59 -3.23l-3.51 .01l2.5 -4.67" />',
    "tabler:steering-wheel": '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 14v7" /><path d="M10 12l-6.75 -2" /><path d="M14 12l6.75 -2" />',
    "tabler:link": '<path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" /><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />',
    "tabler:vocabulary": '<path d="M10 19h-6a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1h6a2 2 0 0 1 2 2a2 2 0 0 1 2 -2h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2z" /><path d="M12 5v16" /><path d="M7 7h1" /><path d="M7 11h1" /><path d="M16 7h1" /><path d="M16 11h1" /><path d="M16 15h1" />',
    "tabler:engine": '<path d="M3 10v6" /><path d="M12 5v14" /><path d="M10 5h4" /><path d="M10 19h4" /><path d="M5 10h14" /><path d="M5 16h14" /><path d="M8 8a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />',
    "tabler:robot-face": '<path d="M15 11l0 .01" /><path d="M9 11l0 .01" /><path d="M6 13l0 2a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-2" /><path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1" /><path d="M7 10h10a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a2 2 0 0 1 2 -2z" /><path d="M12 4v4" />',
    "tabler:calendar-time": '<path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M15 3l0 4" /><path d="M7 3l0 4" /><path d="M3 11l16 0" /><path d="M18 16.496v1.504l1 1" />',
    "tabler:piggy-bank": '<path d="M15 11v.01" /><path d="M5.173 13.574c-.114 .456 -1.173 1.426 -1.173 1.426h2v2h11v-12c0 -1.105 -1.119 -2 -2.5 -2c-1.127 0 -2.091 .607 -2.394 1.455c-.179 -.015 -.36 -.022 -.544 -.022c-2.31 0 -4.267 1.104 -5.043 2.652c-.308 -.102 -.642 -.152 -.984 -.152c-1.381 0 -2.5 1.104 -2.5 2.5c0 .359 .075 .699 .21 1.007c-.446 .419 -.86 1 -.86 1.634v.001z" /><path d="M14 20v1" /><path d="M11 20v1" />',
    "tabler:filter-check": '<path d="M11.18 20.274l-2.18 .726v-9l-4.414 -4.414a2 2 0 0 1 -.586 -1.414v-2.172h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v4" /><path d="M15 19l2 2l4 -4" />',
    "tabler:mood-smile-beam": '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 10c-.5 -1 -2.5 -1 -3 0" /><path d="M17 10c-.5 -1 -2.5 -1 -3 0" /><path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />',
    "tabler:arrow-up-right": '<path d="M17 7l-10 10" /><path d="M8 7l9 0l0 9" />',
    "tabler:coin": '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" /><path d="M12 7l0 2" /><path d="M12 15l0 2" />',
    "tabler:messages": '<path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" /><path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />',
    "tabler:layout-grid": '<path d="M4 4h6v6h-6z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6h-6z" /><path d="M14 14h6v6h-6z" />',
  };

  return defineComponent({
    render() {
      return h("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        innerHTML: icons[iconName] || "",
      });
    },
  });
};

// GSAP-like simple transitions
const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(30px)";
};
const enter = (el, done) => {
  el.offsetHeight; // force reflow
  el.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
  el.style.opacity = 1;
  el.style.transform = "translateY(0)";
  el.addEventListener("transitionend", done);
};
const leave = (el, done) => {
  el.style.transition = "all 0.4s ease-in";
  el.style.opacity = 0;
  el.style.transform = "translateY(-30px)";
  el.addEventListener("transitionend", done);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap");

.font-sans {
  font-family: "Poppins", sans-serif;
}

/* Custom Scrollbar for the main view just in case */
::-webkit-scrollbar {
  width: 0px;
}
</style>
