<script setup lang="ts">
import { ref, computed } from "vue";
import { supabase } from "../../lib/supabase";

const props = defineProps<{
  initialLeads: any[];
}>();

const leads = ref([...props.initialLeads]);
const isLoading = ref(false);
const searchQuery = ref("");
const statusFilter = ref("all");
const currentPage = ref(1);
const leadsPerPage = 10;
const showLogoutModal = ref(false);

const reloadLeads = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    leads.value = data || [];
  } catch (e) {
    console.error('Error reloading leads:', e);
    alert('Error al recargar los datos');
  } finally {
    isLoading.value = false;
  }
};

const normalizeText = (text: string) => {
  return text
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
};

const processedLeads = computed(() => {
  return leads.value.map((lead) => {
    const details =
      typeof lead.details === "string"
        ? JSON.parse(lead.details)
        : lead.details || {};
    return {
      ...lead,
      service:
        lead.service || details.service || details.service_id || "General",
      goal: lead.goal || details.goal || "-",
      need: lead.need || details.need || "",
      business_type:
        lead.business_type || details.business_type || "No especificado",
      country_code: lead.country_code || details.country_code || "",
      scheduled_at: lead.scheduled_at || null,
    };
  });
});

const filteredLeads = computed(() => {
  const query = normalizeText(searchQuery.value);
  return processedLeads.value.filter((lead) => {
    const matchesSearch =
      normalizeText(lead.name).includes(query) ||
      (lead.email && normalizeText(lead.email).includes(query)) ||
      (lead.whatsapp && normalizeText(lead.whatsapp).includes(query)) ||
      (lead.company && normalizeText(lead.company).includes(query)) ||
      (lead.service && normalizeText(lead.service).includes(query));

    const matchesStatus =
      statusFilter.value === "all" || lead.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * leadsPerPage;
  const end = start + leadsPerPage;
  return filteredLeads.value.slice(start, end);
});

const totalPages = computed(
  () => Math.ceil(filteredLeads.value.length / leadsPerPage) || 1
);

const updateStatus = async (leadId: string, newStatus: string) => {
  const { error } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId);

  if (error) {
    console.error("Error updating status:", error);
  } else {
    const lead = leads.value.find((l) => l.id === leadId);
    if (lead) lead.status = newStatus;
  }
};

const deleteLead = async (leadId: string) => {
  if (!confirm("¿Estás seguro de que quieres eliminar este lead?")) return;

  const { error } = await supabase.from("leads").delete().eq("id", leadId);

  if (error) {
    console.error("Error deleting lead:", error);
  } else {
    leads.value = leads.value.filter((l) => l.id !== leadId);
  }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/login";
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-[#FF8A00]";
    case "contacted":
      return "bg-green-100 text-green-600";
    default:
      return "bg-neutral-100 text-neutral-400";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "contacted":
      return "Contactado";
    default:
      return "Descartado";
  }
};
</script>

<template>
  <main class="min-h-screen bg-neutral-50 pb-20">
    <!-- Logout Modal -->
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-neutral-800/40 backdrop-blur-sm"
        @click="showLogoutModal = false"
      ></div>
      <div
        class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center transition-all transform scale-100"
      >
        <div
          class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-800 mb-2">¿Estás seguro?</h3>
        <p class="text-neutral-500 mb-8">
          Estás a punto de cerrar tu sesión actual.
        </p>
        <div class="flex gap-3">
          <button
            @click="showLogoutModal = false"
            class="flex-1 px-6 py-3 bg-neutral-100 text-neutral-500 font-bold rounded-xl hover:bg-neutral-200 transition-all"
          >
            Cancelar
          </button>
          <button
            @click="handleLogout"
            class="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <header class="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div
        class="max-w-6xl mx-auto px-12 h-20 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-[#FF8A00] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-neutral-800">
            Ganex <span class="text-neutral-400 font-medium">| Leads</span>
          </h1>
        </div>
        <button
          @click="showLogoutModal = true"
          class="text-sm font-bold text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-2"
        >
          <span>Cerrar Sesión</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-12 pt-10">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h2 class="text-2xl font-bold text-neutral-800 tracking-tight">
            Gestión de Clientes
          </h2>
          <p class="text-neutral-500">
            Visualiza y gestiona las solicitudes de tus clientes.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="reloadLeads"
            :disabled="isLoading"
            class="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all text-sm font-bold text-neutral-600 disabled:opacity-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              :class="['w-4 h-4', isLoading && 'animate-spin']"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isLoading ? 'Recargando...' : 'Recargar' }}</span>
          </button>
          <div
            class="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm"
          >
            <span
              class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            ></span>
            <span class="text-sm font-bold text-neutral-700"
              ><span>{{ leads.length }}</span> Leads totales</span
            >
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-8 group">
        <div class="relative max-w-2xl">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-[#FF8A00] transition-colors"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, email, servicio..."
            class="w-full bg-white border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-50/50 focus:border-[#FF8A00] transition-all shadow-sm group-hover:shadow-md"
          />
        </div>
      </div>

      <!-- Status Filter -->
      <div class="mb-10 flex flex-wrap gap-3 items-center">
        <button
          v-for="status in ['all', 'pending', 'contacted', 'discarded']"
          :key="status"
          @click="statusFilter = status"
          :class="[
            'px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border-2 active:scale-95 cursor-pointer',
            statusFilter === status
              ? 'bg-[#FF8A00] text-white border-transparent shadow-xl shadow-orange-100'
              : 'bg-white text-neutral-400 border-neutral-50 hover:border-orange-200',
          ]"
        >
          {{
            status === "all"
              ? "Todos"
              : status === "pending"
              ? "Pendientes"
              : status === "contacted"
              ? "Contactados"
              : "Descartados"
          }}
        </button>
      </div>

      <!-- Desktop View: Table -->
      <div
        class="hidden lg:block bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden"
      >
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-neutral-50/50 border-b border-neutral-100 font-bold text-neutral-400 text-[11px] uppercase tracking-widest"
            >
              <th class="px-6 py-5">Lead / Fecha</th>
              <th class="px-6 py-5">Contacto</th>
              <th class="px-6 py-5">Servicio / Objetivo</th>
              <th class="px-6 py-5">Empresa</th>
              <th class="px-6 py-5">Reunión</th>
              <th class="px-6 py-5">Estado</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-50">
            <tr
              v-for="lead in paginatedLeads"
              :key="lead.id"
              class="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group"
            >
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400"
                  >
                    {{ lead.name[0]?.toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-neutral-800">
                      {{ lead.name }}
                    </div>
                    <div class="text-xs text-neutral-400">
                      {{ formatDate(lead.created_at) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1">
                  <a
                    :href="
                      'https://wa.me/' +
                      (lead.whatsapp || lead.phone || '').replace(/[^0-9]/g, '')
                    "
                    target="_blank"
                    class="text-sm font-bold text-neutral-700 hover:text-[#FF8A00] transition-colors flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3.5 h-3.5 text-[#25D366]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.001c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                      />
                    </svg>
                    {{ lead.whatsapp || lead.phone || "-" }}
                  </a>
                  <div class="text-[10px] text-neutral-400">
                    {{ lead.email || "-" }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-neutral-700">{{
                    lead.service
                  }}</span>
                  <span
                    class="text-xs text-neutral-400 truncate max-w-[150px]"
                    >{{ lead.goal }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-sm text-neutral-600">{{
                    lead.company || "-"
                  }}</span>
                  <span
                    class="text-[10px] text-neutral-400 uppercase tracking-tighter"
                    >{{ lead.business_type }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-5">
                <div v-if="lead.scheduled_at" class="flex flex-col">
                  <div class="flex items-center gap-2 text-sm font-bold text-[#FF8A00]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDateTime(lead.scheduled_at) }}</span>
                  </div>
                  <span class="text-[10px] text-neutral-400 mt-1">Reunión programada</span>
                </div>
                <span v-else class="text-xs text-neutral-400">Sin reunión</span>
              </td>
              <td class="px-6 py-5">
                <select
                  @change="
                    updateStatus(
                      lead.id,
                      ($event.target as HTMLSelectElement).value
                    )
                  "
                  class="update-status w-full text-xs border-neutral-100 bg-neutral-50 rounded-xl px-3 py-2 focus:ring-0 focus:border-orange-200 text-neutral-500 font-medium cursor-pointer"
                >
                  <option value="pending" :selected="lead.status === 'pending'">
                    Pendiente
                  </option>
                  <option
                    value="contacted"
                    :selected="lead.status === 'contacted'"
                  >
                    Contactado
                  </option>
                  <option
                    value="discarded"
                    :selected="lead.status === 'discarded'"
                  >
                    Descartado
                  </option>
                </select>
              </td>
              <td class="px-6 py-5 text-right">
                <button
                  @click="deleteLead(lead.id)"
                  class="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div
          class="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-neutral-100 shadow-sm"
          v-if="filteredLeads.length > 0"
        >
          <div class="text-sm text-neutral-500">
            Mostrando
            <span class="font-bold text-neutral-800"
              >{{ (currentPage - 1) * leadsPerPage + 1 }}-{{
                Math.min(currentPage * leadsPerPage, filteredLeads.length)
              }}</span
            >
            de
            <span class="font-bold text-neutral-800">{{
              filteredLeads.length
            }}</span>
            resultados
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 text-neutral-400 hover:text-[#FF8A00] disabled:opacity-30 transition-colors cursor-pointer"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 text-neutral-400 hover:text-[#FF8A00] disabled:opacity-30 transition-colors cursor-pointer"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="filteredLeads.length === 0" class="py-20 text-center">
          <div
            class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-neutral-400">
            No se encontraron leads
          </h3>
        </div>
      </div>

      <!-- Mobile/Tablet View: Cards -->
      <div class="lg:hidden space-y-4">
        <div
          v-for="lead in paginatedLeads"
          :key="lead.id"
          class="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 space-y-4"
        >
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 text-lg"
              >
                {{ lead.name[0]?.toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-neutral-800 text-lg">
                  {{ lead.name }}
                </div>
                <div class="text-xs text-neutral-400">
                  {{ formatDate(lead.created_at) }}
                </div>
              </div>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold',
                getStatusClass(lead.status),
              ]"
            >
              {{ getStatusText(lead.status) }}
            </span>
          </div>

          <!-- Contact Info -->
          <div class="space-y-2 pt-2 border-t border-neutral-50">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-[#25D366]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.001c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
              <a
                :href="
                  'https://wa.me/' +
                  (lead.whatsapp || lead.phone || '').replace(/[^0-9]/g, '')
                "
                target="_blank"
                class="text-sm font-bold text-neutral-700 hover:text-[#FF8A00] transition-colors"
              >
                {{ lead.whatsapp || lead.phone || "-" }}
              </a>
            </div>
            <div class="text-xs text-neutral-500 pl-6">
              {{ lead.email || "-" }}
            </div>
          </div>

          <!-- Service & Company -->
          <div class="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-50">
            <div>
              <div class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                Servicio
              </div>
              <div class="text-sm font-bold text-neutral-700">
                {{ lead.service }}
              </div>
              <div class="text-xs text-neutral-400 truncate">
                {{ lead.goal }}
              </div>
            </div>
            <div>
              <div class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                Empresa
              </div>
              <div class="text-sm text-neutral-600">
                {{ lead.company || "-" }}
              </div>
              <div class="text-[10px] text-neutral-400 uppercase">
                {{ lead.business_type }}
              </div>
            </div>
          </div>

          <!-- Meeting Info -->
          <div v-if="lead.scheduled_at" class="pt-2 border-t border-neutral-50">
            <div class="flex items-center gap-2 text-sm font-bold text-[#FF8A00]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDateTime(lead.scheduled_at) }}</span>
            </div>
            <div class="text-[10px] text-neutral-400 mt-1 pl-6">Reunión programada</div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2 border-t border-neutral-50">
            <select
              @change="
                updateStatus(
                  lead.id,
                  ($event.target as HTMLSelectElement).value
                )
              "
              class="flex-1 text-xs border-neutral-100 bg-neutral-50 rounded-xl px-3 py-2 focus:ring-0 focus:border-orange-200 text-neutral-500 font-medium cursor-pointer"
            >
              <option value="pending" :selected="lead.status === 'pending'">
                Pendiente
              </option>
              <option
                value="contacted"
                :selected="lead.status === 'contacted'"
              >
                Contactado
              </option>
              <option
                value="discarded"
                :selected="lead.status === 'discarded'"
              >
                Descartado
              </option>
            </select>
            <button
              @click="deleteLead(lead.id)"
              class="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div
          class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-neutral-100 shadow-sm"
          v-if="filteredLeads.length > 0"
        >
          <div class="text-sm text-neutral-500 text-center sm:text-left">
            Mostrando
            <span class="font-bold text-neutral-800"
              >{{ (currentPage - 1) * leadsPerPage + 1 }}-{{
                Math.min(currentPage * leadsPerPage, filteredLeads.length)
              }}</span
            >
            de
            <span class="font-bold text-neutral-800">{{
              filteredLeads.length
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 text-neutral-400 hover:text-[#FF8A00] disabled:opacity-30 transition-colors cursor-pointer"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 text-neutral-400 hover:text-[#FF8A00] disabled:opacity-30 transition-colors cursor-pointer"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="filteredLeads.length === 0" class="py-20 text-center bg-white rounded-3xl">
          <div
            class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-neutral-400">
            No se encontraron leads
          </h3>
        </div>
      </div>
    </div>
  </main>
</template>
