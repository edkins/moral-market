class CharitiesController < ApplicationController
  def index
    @charities = Charity.all
  end

  def show
    @charity = Charity.find(params[:id])
  end

  def new
  end

  def edit
    @charity = Charity.find(params[:id])
  end

  def create
    @charity = Charity.new(params.require(:charity).permit(:name))
    @charity.save
    redirect_to @charity
  end

  def update
    @charity = Charity.find(params[:id])
    @charity.update(params.require(:charity).permit(:name))
    redirect_to @charity
  end

  def destroy
    @charity = Charity.find(params[:id])
    @charity.destroy
    redirect_to charities_path
  end
end
