import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar, Send, Plus, Eye, Edit, Trash2, Clock, CheckCircle, TrendingUp, BarChart3, MessageCircle, FileText, Megaphone } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { useAuth } from '../../contexts/AuthContext';

const CustomerCommunicationHub = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  
  // Data states
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [followUpTasks, setFollowUpTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Modal states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Form states
  const [templateForm, setTemplateForm] = useState({
    template_name: '',
    template_type: 'email',
    subject: '',
    content: '',
    variables: {}
  });

  const [campaignForm, setCampaignForm] = useState({
    campaign_name: '',
    template_id: '',
    channel: 'email',
    scheduled_at: ''
  });

  const [taskForm, setTaskForm] = useState({
    customer_id: '',
    assigned_to: '',
    task_title: '',
    task_description: '',
    priority: 'medium',
    due_date: ''
  });

  // Filters
  const [filters, setFilters] = useState({
    channel: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    customerId: ''
  });

  useEffect(() => {
    if (user) {
      loadCommunicationData();
    }
  }, [user, filters]);

  const loadCommunicationData = async () => {
    setLoading(true);
    try {
      const [logsData, templatesData, campaignsData, tasksData, analyticsData] = await Promise.all([
        communicationService?.getCommunicationLogs(),
        communicationService?.getTemplates(),
        communicationService?.getCampaigns(),
        communicationService?.getFollowUpTasks({ isCompleted: false }),
        communicationService?.getCommunicationAnalytics(
          filters?.dateFrom || new Date(new Date().getFullYear(), 0, 1)?.toISOString(),
          filters?.dateTo || new Date()?.toISOString()
        )
      ]);

      setCommunicationLogs(logsData || []);
      setTemplates(templatesData || []);
      setCampaigns(campaignsData || []);
      setFollowUpTasks(tasksData || []);
      setAnalytics(analyticsData || {});
    } catch (error) {
      console.error('Error loading communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e?.preventDefault();
    try {
      await communicationService?.createTemplate(templateForm);
      setShowTemplateModal(false);
      setTemplateForm({
        template_name: '',
        template_type: 'email',
        subject: '',
        content: '',
        variables: {}
      });
      loadCommunicationData();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleCreateCampaign = async (e) => {
    e?.preventDefault();
    try {
      await communicationService?.createCampaign({
        ...campaignForm,
        status: campaignForm?.scheduled_at ? 'scheduled' : 'draft'
      });
      setShowCampaignModal(false);
      setCampaignForm({
        campaign_name: '',
        template_id: '',
        channel: 'email',
        scheduled_at: ''
      });
      loadCommunicationData();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e?.preventDefault();
    try {
      await communicationService?.createFollowUpTask({
        ...taskForm,
        assigned_to: taskForm?.assigned_to || user?.id
      });
      setShowTaskModal(false);
      setTaskForm({
        customer_id: '',
        assigned_to: '',
        task_title: '',
        task_description: '',
        priority: 'medium',
        due_date: ''
      });
      loadCommunicationData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await communicationService?.updateFollowUpTask(taskId, {
        is_completed: true,
        completed_at: new Date()?.toISOString()
      });
      loadCommunicationData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <Mail className="w-5 h-5 text-blue-500" />;
      case 'sms': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'phone': return <Phone className="w-5 h-5 text-purple-500" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5 text-green-600" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'opened': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'clicked': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Customer Communication Hub
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Centralized communication management with email, SMS, and follow-up tracking
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  New Template
                </button>
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  New Campaign
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Send className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Communications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {analytics?.totalSent || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Delivery Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {analytics?.engagementRates?.deliveryRate?.toFixed(1) || 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Open Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {analytics?.engagementRates?.openRate?.toFixed(1) || 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {followUpTasks?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              {[
                { key: 'timeline', label: 'Communication Timeline', icon: MessageSquare },
                { key: 'templates', label: 'Templates', icon: FileText },
                { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
                { key: 'tasks', label: 'Follow-up Tasks', icon: Clock }
              ]?.map((tab) => (
                <button
                  key={tab?.key}
                  onClick={() => setActiveTab(tab?.key)}
                  className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === tab?.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' :'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab?.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Communication Timeline */}
          {activeTab === 'timeline' && (
            <div className="p-6">
              <div className="space-y-6">
                {communicationLogs?.map((log) => (
                  <div key={log?.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      {getChannelIcon(log?.channel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {log?.customer?.company_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {log?.customer?.contact_person} • {log?.recipient_email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log?.status)}`}>
                            {log?.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(log?.sent_at)?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {log?.subject}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {log?.content}
                        </p>
                      </div>
                      {log?.campaign && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Campaign: {log?.campaign?.campaign_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates */}
          {activeTab === 'templates' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map((template) => (
                  <div key={template?.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {template?.template_name}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        template?.template_type === 'email' ?'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {template?.template_type}
                      </span>
                    </div>
                    {template?.subject && (
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {template?.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {template?.content}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns */}
          {activeTab === 'campaigns' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Channel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Recipients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {campaigns?.map((campaign) => (
                      <tr key={campaign?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {campaign?.campaign_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {campaign?.template?.template_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getChannelIcon(campaign?.channel)}
                            <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                              {campaign?.channel}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {campaign?.sent_count || 0} / {campaign?.recipient_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign?.status)}`}>
                            {campaign?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="text-xs">
                            <div>Delivered: {campaign?.delivered_count || 0}</div>
                            <div>Opened: {campaign?.opened_count || 0}</div>
                            <div>Clicked: {campaign?.clicked_count || 0}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-gray-600 hover:text-gray-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Follow-up Tasks */}
          {activeTab === 'tasks' && (
            <div className="p-6">
              <div className="space-y-4">
                {followUpTasks?.map((task) => (
                  <div key={task?.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task?.priority)}`}>
                          {task?.priority}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {task?.task_title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCompleteTask(task?.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task?.task_description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Customer: {task?.customer?.company_name}</span>
                        <span>Assigned to: {task?.assigned_user?.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {new Date(task?.due_date)?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create New Template
                </h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={templateForm?.template_name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, template_name: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Type
                  </label>
                  <select
                    value={templateForm?.template_type}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, template_type: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="notification">Notification</option>
                    <option value="follow_up">Follow-up</option>
                  </select>
                </div>

                {templateForm?.template_type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={templateForm?.subject}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e?.target?.value }))}
                      placeholder="Use {customer_name}, {invoice_number} for variables"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={templateForm?.content}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e?.target?.value }))}
                    placeholder="Use {customer_name}, {company_name}, {amount} for variables"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create New Campaign
                </h3>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignForm?.campaign_name}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, campaign_name: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template
                  </label>
                  <select
                    required
                    value={campaignForm?.template_id}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, template_id: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Template</option>
                    {templates?.map((template) => (
                      <option key={template?.id} value={template?.id}>
                        {template?.template_name} ({template?.template_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Channel
                  </label>
                  <select
                    value={campaignForm?.channel}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, channel: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schedule Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={campaignForm?.scheduled_at}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduled_at: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create Follow-up Task
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={taskForm?.task_title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, task_title: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={taskForm?.task_description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, task_description: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskForm?.priority}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={taskForm?.due_date}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, due_date: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCommunicationHub;