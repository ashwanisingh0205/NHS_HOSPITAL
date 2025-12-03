<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
        <!-- Mobile Overlay -->
    <div
      v-if="isMobileMenuOpen"
            @click="isMobileMenuOpen = false"
      class="fixed top-14 sm:top-16 inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
    />

        <!-- Icon Sidebar -->
        <aside
            class="fixed lg:static inset-y-0 left-0 z-50 w-16 bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800 shadow-xl lg:shadow-none transition-transform duration-300"
            :class="[
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                { 'blur-sm pointer-events-none': isNotificationPanelOpen }
            ]"
        >
      <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 relative">
        <img src="/assets/images/NHS-logo.png" alt="NHS Logo" class="h-10 w-10 object-contain" />
        <UButton
                    @click.stop="isMobileMenuOpen = false"
          variant="primary"
          size="xs"
          icon="lucide:x"
          class="lg:hidden absolute top-2 right-2 w-6 h-6 p-0"
        />
      </div>

            <nav class="flex-1 flex flex-col items-center py-4 space-y-2">
        <UButton
          v-for="item in mainNavItems"
          :key="item.id"
          @click="handleMainNavClick(item.id)"
                    variant="primary"
          :icon="item.icon"
          :ui="getNavButtonUI(item.id)"
          :title="item.name"
        />
      </nav>
    </aside>

        <!-- Secondary Sidebar -->
        <aside
            class="fixed lg:static inset-y-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 overflow-hidden shadow-xl lg:shadow-none"
            :class="[
                isMobileMenuOpen ? 'left-16' : 'left-0 lg:left-auto',
                !isMobileMenuOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
                isSidebarCollapsed ? 'w-0' : 'w-64',
                { 'blur-sm pointer-events-none': isNotificationPanelOpen }
            ]"
        >
      <div v-if="!isSidebarCollapsed" class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{{ currentSectionName }}</h2>
        <UButton
                    @click.stop="isMobileMenuOpen = false"
          variant="primary"
          size="sm"
          icon="lucide:x"
          class="lg:hidden w-8 h-8 shrink-0"
        />
      </div>

      <div v-if="!isSidebarCollapsed" class="p-4 border-b border-gray-200 dark:border-gray-800">
                <UInput icon="i-lucide-search" type="text" placeholder="Search..." />
      </div>

      <div v-if="!isSidebarCollapsed" class="flex-1 flex flex-col overflow-hidden">
                <nav class="flex-1 overflow-y-auto p-3">
          <div class="space-y-1">
            <template v-for="item in currentNavItems" :key="item.name">
              <NuxtLink
                v-if="!item.children"
                :to="item.path"
                                @click="isMobileScreen && (isMobileMenuOpen = false)"
                                class="flex items-center justify-between px-3 py-2 rounded-lg text-sm group"
                :class="isActive(item.path) 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                  <span class="truncate">{{ item.name }}</span>
                </div>
                <UIcon 
                  v-if="item.count" 
                  name="lucide:chevron-right" 
                  class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" 
                />
              </NuxtLink>

              <div v-else>
                <UButton
                  @click="toggleExpanded(item.name)"
                  variant="primary"
                                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                    <span class="truncate">{{ item.name }}</span>
                  </div>
                  <UIcon 
                    name="lucide:chevron-down" 
                    class="w-4 h-4 text-gray-400 shrink-0 transition-transform"
                    :class="expandedItems.includes(item.name) ? 'rotate-180' : ''"
                  />
                </UButton>
                
                                <ul v-if="expandedItems.includes(item.name)" class="ml-8 mt-1 space-y-1">
                  <li v-for="child in item.children" :key="child.name">
                    <NuxtLink
                      :to="child.path"
                                            @click="isMobileScreen && (isMobileMenuOpen = false)"
                      class="flex items-center px-3 py-2 rounded-lg text-sm"
                      :class="isActive(child.path) 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </nav>

        <div class="p-3 pt-2 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <UButton
                        @click="navigateTo('/upgrade')"
              variant="primary"
                        class="w-full justify-center gap-2 border border-gray-300 hover:bg-gray-200"
              icon="lucide:sparkles"
              label="Upgrade"
            />
        </div>
      </div>
    </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden w-full lg:w-auto" :class="{ 'blur-sm pointer-events-none': isNotificationPanelOpen }">
      <header class="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6 z-30">
        <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <UButton
                        @click.stop="isMobileMenuOpen = !isMobileMenuOpen"
            variant="primary"
            size="sm"
            :icon="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
            class="lg:hidden w-9 h-9 shrink-0"
          />
          <UButton
                        @click.stop="isSidebarCollapsed = !isSidebarCollapsed"
            variant="primary"
            size="sm"
            :icon="isSidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
            class="hidden lg:flex w-9 h-9 shrink-0"
          />
          
                    <nav class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1">
            <span class="text-gray-500 dark:text-gray-400 hidden sm:inline">Home</span>
            <UIcon name="lucide:chevron-right" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 hidden sm:inline shrink-0" />
            <span class="text-gray-500 dark:text-gray-400 truncate">{{ currentSectionName }}</span>
            <UIcon name="lucide:chevron-right" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <span class="text-gray-900 dark:text-gray-100 font-medium truncate">{{ pageTitle || 'Overview' }}</span>
          </nav>
        </div>

        <div class="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          <UButton
            variant="primary"
                        size="md"
                        icon="tabler:message"
            class="relative w-8 h-8 sm:w-9 sm:h-9"
                        @click="isNotificationPanelOpen = !isNotificationPanelOpen"
          >
            <span 
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center px-0.5 sm:px-1 bg-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-full border-2 border-white dark:border-gray-900"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </UButton>
          
                    <UButton
                        variant="primary"
                        class="md:flex items-center px-2 py-0.5 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div class="relative shrink-0">
                            <div class="w-12 h-12 rounded-full border border-purple-200/50 dark:border-purple-300/50 bg-sky-100 dark:bg-sky-900/50 p-0.5">
                                <div class="w-full h-full rounded-full overflow-hidden bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                                    <img
                                        :src="accountManagerAvatar"
                                        :alt="accountManagerName"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-start min-w-0">
                            <span class="text-sm text-black dark:text-purple-100 leading-tight whitespace-nowrap">Meet {{ accountManagerName }}</span>
                            <span class="text-xs text-black dark:text-purple-100 leading-tight whitespace-nowrap">Your Account Manager</span>
                        </div>
                    </UButton>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
                <div class="mb-4 sm:mb-6">
                    <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">{{ pageTitle || 'Dashboard' }}</h1>
                    <p v-if="pageDescription" class="text-sm sm:text-base text-gray-600 dark:text-gray-400">{{ pageDescription }}</p>
                </div>
                <slot />
            </main>
        </div>

        <!-- Notification Panel -->
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform translate-x-full"
            enter-to-class="transform translate-x-0"
            leave-active-class="transition ease-in duration-300"
            leave-from-class="transform translate-x-0"
            leave-to-class="transform translate-x-full"
        >
            <div
                v-if="isNotificationPanelOpen"
                class="fixed inset-y-0 right-0 w-full sm:w-96 lg:w-[420px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
                <!-- Header with Title and Close -->
                <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center">Notifications</h2>
                    <UButton
                        @click="isNotificationPanelOpen = false"
                        variant="ghost"
                        size="sm"
                        icon="lucide:x"
                        class="w-8 h-8 shrink-0"
                    />
                </div>

                <!-- Tabs with Settings -->
                <div class="flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-4">
                        <button
                            v-for="tab in notificationTabs"
                            :key="tab.id"
                            @click="activeNotificationTab = tab.id"
                            class="py-3 text-sm font-medium border-b-2 transition-colors"
                            :class="activeNotificationTab === tab.id
                                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'"
                        >
                            {{ tab.name }}
                        </button>
                    </div>
                    <UButton
                        variant="ghost"
                        size="sm"
                        icon="lucide:settings"
                        class="w-8 h-8 shrink-0"
                    />
                </div>

                <!-- Notification List -->
                <div class="flex-1 overflow-y-auto">
                    <div class="divide-y divide-gray-200 dark:divide-gray-700">
                        <div
                            v-for="notification in filteredNotifications"
                            :key="notification.id"
                            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <div class="flex items-start gap-3">
                                <div class="relative shrink-0">
                                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        <img
                                            :src="notification.avatar"
                                            :alt="notification.user"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 dark:text-white">
                                        <span class="font-medium">{{ notification.user }}</span>
                                        {{ notification.text }}
                                        <span v-if="notification.highlight" class="text-blue-600 dark:text-blue-400 font-medium">{{ notification.highlight }}</span>
                                        <span v-if="notification.textAfter"> {{ notification.textAfter }}</span>
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {{ notification.time }} • {{ notification.context }}
                                    </p>

                                    <!-- Tags -->
                                    <div v-if="notification.tags" class="flex flex-wrap gap-2 mt-2">
                                        <span
                                            v-for="tag in notification.tags"
                                            :key="tag"
                                            class="px-2 py-1 text-xs rounded-full font-medium"
                                            :class="tag.class"
                                        >
                                            {{ tag.label }}
                                        </span>
                                    </div>

                                    <!-- File Attachment -->
                                    <div v-if="notification.file" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
                                                <UIcon name="lucide:file-text" class="w-5 h-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ notification.file.name }}</p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ notification.file.time }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div v-if="notification.actions" class="flex gap-2 mt-3">
                                        <UButton
                                            v-for="action in notification.actions"
                                            :key="action.label"
                                            @click="handleNotificationAction(notification.id, action.type)"
                                            :variant="action.variant"
                                            size="sm"
                                            :label="action.label"
                                            :class="action.class"
                                        />
                                    </div>

                                    <!-- Reply Input -->
                                    <div v-if="notification.showReply" class="mt-3">
                                        <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                            <input
                                                type="text"
                                                :placeholder="notification.replyPlaceholder || 'Reply'"
                                                class="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none px-3 py-2"
                                            />
                                            <div class="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                                                <UButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon="lucide:paperclip"
                                                    class="w-8 h-8"
                                                />
                                                <UButton
                                                    variant="primary"
                                                    size="sm"
                                                    label="Reply"
                                                    icon="lucide:send"
                                                    class="h-8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Notification Panel Overlay -->
        <div
            v-if="isNotificationPanelOpen"
            @click="isNotificationPanelOpen = false"
            class="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
        />

        <!-- User Profile -->
        <div ref="userMenuRef" class="fixed bottom-5 left-3 z-50">
            <UButton
              variant="primary"
              size="sm"
                class="w-10 h-10 p-0 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all border-2 border-emerald-500 dark:border-emerald-400 shadow-lg"
              :class="isUserMenuOpen ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''"
              @click="isUserMenuOpen = !isUserMenuOpen"
            >
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold text-sm">
                <span v-if="!userAvatar">{{ userInitials }}</span>
                <img v-else :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              </div>
            </UButton>

              <div
                v-if="isUserMenuOpen"
                class="absolute bottom-14 left-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 z-50 overflow-hidden"
                @click.stop
              >
                <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <div class="relative shrink-0">
                      <div class="w-12 h-12 rounded-full border-2 border-emerald-500 dark:border-emerald-400 p-0.5">
                        <div class="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-white font-semibold">
                          <span v-if="!userAvatar" class="text-sm">{{ userInitials }}</span>
                          <img v-else :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ userName }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
                    </div>
                  </div>
                </div>

                <div class="py-2">
                    <UButton
                        @click="isUserMenuOpen = false; navigateTo('/profile')"
                        variant="ghost"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors justify-start"
                        icon="lucide:user"
                        label="My Profile"
                    />

                    <UButton
                        @click="isUserMenuOpen = false; navigateTo('/settings')"
                        variant="primary"
                        class="w-full flex items-center gap-3 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        icon="lucide:settings"
                        label="Settings"
                    />
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700"></div>

                <div class="px-4 py-2.5">
                    <UButton
                        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
                        variant="primary"
                        class="w-full flex items-center justify-between gap-4 text-sm text-gray-700 dark:text-gray-300 transition-colors rounded-lg px-2 py-1.5 -mx-2"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon name="lucide:moon" class="w-4 h-4 shrink-0" />
                      <span>Dark Mode</span>
                    </div>
                    <div
                      class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="isDarkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
                    >
                      <span
                        class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        :class="isDarkMode ? 'translate-x-4' : 'translate-x-0.5'"
                        style="margin-top: 2px;"
                      />
                    </div>
                    </UButton>
                </div>

                <div class="px-4 pb-3 pt-2">
                  <UButton
                        @click="isUserMenuOpen = false; navigateTo('/')"
                    label="Log out"
                    variant="primary"
                    color="red"
                    class="w-full justify-center border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
                </div>
              </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['pageTitle', 'pageDescription']);
const route = useRoute();
const colorMode = useColorMode();

const activeSection = ref('dashboard');
const expandedItems = ref(['Settings', 'Team']);
const notificationCount = ref(5);
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationPanelOpen = ref(false);
const activeNotificationTab = ref('all');
const userMenuRef = ref(null);

const userName = ref('NHS Hospital');
const userEmail = ref('nhsuser@example.com');
const userAvatar = ref(null);
const accountManagerName = ref('Helper');
const accountManagerAvatar = ref('https://www.qualtrics.com/sites/default/files/styles/standard_medium_retina/public/2025-11/great-customer-service.jpg.webp?itok=XBoyPxI_');

const userInitials = computed(() => {
  if (!userName.value) return 'U';
  const names = userName.value.split(' ');
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : userName.value.substring(0, 2).toUpperCase();
});

const isDarkMode = computed(() => colorMode.value === 'dark');
const isMobileScreen = computed(() => globalThis.window !== undefined && globalThis.window.innerWidth < 1024);

const notificationTabs = [
    { id: 'all', name: 'All' },
    { id: 'inbox', name: 'Inbox' },
    { id: 'team', name: 'Team' },
    { id: 'following', name: 'Following' },
];

const notifications = ref([
    {
        id: 1,
        user: 'Joe Lincoln',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        text: 'mentioned you in',
        highlight: 'Latest Trends',
        textAfter: 'topic',
        time: '18 mins ago',
        context: 'Web Design 2024',
        showReply: true,
        replyPlaceholder: '@Cody For an expert opinion, check out what Mike has to say on this topic!',
        tab: 'inbox',
    },
    {
        id: 2,
        user: 'Leslie Alexander',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        text: 'added new tags to',
        highlight: 'Web Redesign 2024',
        time: '53 mins ago',
        context: 'ACME',
        tags: [
            { label: 'Client-Request', class: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
            { label: 'Figma', class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
            { label: 'Redesign', class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
        ],
        tab: 'team',
    },
    {
        id: 3,
        user: 'Guy Hawkins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        text: 'requested access to',
        highlight: 'AirSpace',
        time: '14 hours ago',
        context: 'Dev Team',
        actions: [
            { label: 'Decline', type: 'decline', variant: 'ghost', class: 'border border-gray-300 dark:border-gray-600' },
            { label: 'Accept', type: 'accept', variant: 'primary', class: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' },
        ],
        tab: 'team',
    },
    {
        id: 4,
        user: 'Jane Perez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        text: 'invites you to review a file.',
        time: '3 hours ago',
        context: '742kb',
        file: {
            name: 'Launch_nov24.pptx',
            time: 'Edited 39 mins ago',
        },
        tab: 'inbox',
    },
    {
        id: 5,
        user: 'Raymond Pawell',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        text: 'posted a new article',
        highlight: '2024 Roadmap',
        time: '1 hour ago',
        context: 'Roadmap',
        tab: 'following',
    },
]);

const filteredNotifications = computed(() => {
    if (activeNotificationTab.value === 'all') {
        return notifications.value;
    }
    return notifications.value.filter(n => n.tab === activeNotificationTab.value);
});

const handleNotificationAction = (notificationId, actionType) => {
    console.log(`Notification ${notificationId}: ${actionType}`);
    // Handle accept/decline actions
};

const mainNavItems = [
  { id: 'dashboard', name: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { id: 'projects', name: 'Projects', icon: 'lucide:folder' },
  { id: 'analytics', name: 'Analytics', icon: 'lucide:bar-chart-3' },
  { id: 'team', name: 'Team', icon: 'lucide:users' },
  { id: 'messages', name: 'Messages', icon: 'lucide:message-square' },
  { id: 'calendar', name: 'Calendar', icon: 'lucide:calendar' },
  { id: 'files', name: 'Files', icon: 'lucide:file-text' },
];

const navSections = {
  dashboard: [
    { name: 'Overview', path: '/dashboard', icon: 'lucide:home' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: 'lucide:trending-up' },
    { name: 'Reports', path: '/dashboard/reports', icon: 'lucide:file-bar-chart' },
    { name: 'Statistics', path: '/dashboard/stats', icon: 'lucide:pie-chart' },
  ],
  projects: [
    { name: 'All Projects', path: '/projects', icon: 'lucide:folder-open' },
    { name: 'Active', path: '/projects/active', icon: 'lucide:zap' },
    { name: 'Archived', path: '/projects/archived', icon: 'lucide:archive' },
    { name: 'Templates', path: '/projects/templates', icon: 'lucide:layout-template' },
  ],
  analytics: [
    { name: 'Overview', path: '/analytics', icon: 'lucide:activity' },
    { name: 'Traffic', path: '/analytics/traffic', icon: 'lucide:trending-up' },
    { name: 'Conversion', path: '/analytics/conversion', icon: 'lucide:target' },
    { name: 'Revenue', path: '/analytics/revenue', icon: 'lucide:dollar-sign' },
  ],
  team: [
    { name: 'Members', path: '/team/members', icon: 'lucide:users' },
    { name: 'Roles', path: '/team/roles', icon: 'lucide:shield' },
    { name: 'Permissions', path: '/team/permissions', icon: 'lucide:lock' },
    { 
      name: 'Settings', 
      path: '/team/settings', 
      icon: 'lucide:settings',
      children: [
        { name: 'General', path: '/team/settings/general' },
        { name: 'Security', path: '/team/settings/security' },
        { name: 'Notifications', path: '/team/settings/notifications' },
      ]
    },
  ],
  messages: [
    { name: 'Inbox', path: '/messages', icon: 'lucide:inbox' },
    { name: 'Sent', path: '/messages/sent', icon: 'lucide:send' },
    { name: 'Drafts', path: '/messages/drafts', icon: 'lucide:file-edit' },
    { name: 'Archived', path: '/messages/archived', icon: 'lucide:archive' },
  ],
  calendar: [
    { name: 'Month View', path: '/calendar', icon: 'lucide:calendar-days' },
    { name: 'Week View', path: '/calendar/week', icon: 'lucide:calendar-range' },
    { name: 'Events', path: '/calendar/events', icon: 'lucide:calendar-check' },
    { name: 'Reminders', path: '/calendar/reminders', icon: 'lucide:bell' },
  ],
  files: [
    { name: 'All Files', path: '/files', icon: 'lucide:folder' },
    { name: 'Recent', path: '/files/recent', icon: 'lucide:clock' },
    { name: 'Shared', path: '/files/shared', icon: 'lucide:share-2' },
    { name: 'Trash', path: '/files/trash', icon: 'lucide:trash-2' },
  ],
};

const currentNavItems = computed(() => navSections[activeSection.value] || []);
const currentSectionName = computed(() => mainNavItems.find(item => item.id === activeSection.value)?.name || 'Dashboard');

const getNavButtonUI = (itemId) => {
  const isActive = activeSection.value === itemId;
    return {
        base: isActive
            ? 'transition-all bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
            : 'transition-all text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
      color: {
        gray: {
                ghost: isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                    : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }
        }
    };
};

const toggleExpanded = (itemName) => {
  const index = expandedItems.value.indexOf(itemName);
  index > -1 ? expandedItems.value.splice(index, 1) : expandedItems.value.push(itemName);
};

const isActive = (path) => route.path === path || route.path.startsWith(path + '/');

const handleMainNavClick = (sectionId) => {
  activeSection.value = sectionId;
  if (isMobileScreen.value) {
    isMobileMenuOpen.value = true;
    isSidebarCollapsed.value = false;
  }
};

watch(() => route.path, () => {
    isMobileMenuOpen.value = false;
  isUserMenuOpen.value = false;
    isNotificationPanelOpen.value = false;
});

onMounted(() => {
  const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      isUserMenuOpen.value = false;
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
        onUnmounted(() => document.removeEventListener('click', handleClickOutside));
  }
});
</script>
