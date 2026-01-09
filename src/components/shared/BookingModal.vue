<script setup lang="ts">
import { ref } from "vue";
import BookingFlow from "./BookingFlow.vue";

const props = defineProps<{
  isOpen: boolean;
  initialEmail?: string;
  selectedServices?: string[];
  lang?: string;
  i18n?: Record<string, any>;
}>();

const emit = defineEmits(["close", "success"]);

const handleSuccess = (data: any) => {
  emit("success", data);
  emit("close");
};

const t = (key: string, fallback: string = key) => {
  if (!props.i18n) return fallback;
  const keys = key.split(".");
  let value: any = props.i18n;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback;
  }
  return value;
};
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-neutral-800/60 backdrop-blur-md"
        @click="$emit('close')"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <!-- Header -->
        <div class="p-8 pb-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-black text-neutral-800 tracking-tight">
              {{ t("booking.modal.title", "Agenda tu reunión") }}
            </h2>
            <p class="text-neutral-500 font-medium">
              {{
                t(
                  "booking.modal.subtitle",
                  "Selecciona el mejor momento para conversar"
                )
              }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-8 pt-4">
          <BookingFlow
            :initial-email="initialEmail"
            :selected-services="selectedServices"
            :lang="lang"
            :i18n="i18n"
            @success="handleSuccess"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #e5e5e5;
}
</style>
